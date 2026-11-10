const assert = require('node:assert/strict');
const { join } = require('node:path');
const modules = join(__dirname, '..', '.qa', 'node_modules');
const { chromium } = require(join(modules, 'playwright-core'));
const axe = require(join(modules, 'axe-core'));
const base = 'http://localhost:3100';
const configured = process.argv.includes('--configured');
const testNumber = '12025550100';
const variants = ['', '/services', '/projects', '/products', '/about', '/contact',
  '/services/grass-cutting', '/services/garden-maintenance', '/services/landscaping', '/services/plant-and-irrigation',
  '/projects/villa-garden-makeover', '/projects/outdoor-living-renewal', '/projects/farm-landscape-care'];
const paths = new Set(['en','ar'].flatMap(locale => variants.map(path => '/' + locale + path)));
const failures = [];
let externalAttempts = 0;

function hrefMessage(href) {
  const url = new URL(href);
  assert.equal(url.origin, 'https://wa.me');
  assert.equal(url.pathname, '/' + testNumber);
  assert.deepEqual([...url.searchParams.keys()], ['text']);
  return url.searchParams.get('text');
}

async function markup() {
  for (const route of paths) {
    const response = await fetch(base + route);
    assert.equal(response.status, 200, route);
    const html = await response.text();
    assert.match(html, /name="robots" content="noindex, nofollow"/);
    assert.match(html, /class="whatsapp-widget"/);
    for (const [, link] of html.matchAll(/href="(\/(?:en|ar)[^"#?]*)"/g)) assert(paths.has(link), link);
    const links = [...html.matchAll(/href="(https:\/\/wa\.me\/[^"]+)"/g)].map(match => match[1]);
    if (!configured) {
      assert.equal(links.length, 0, route);
      assert(!html.includes(testNumber));
      assert.match(html, /class="whatsapp-fab" type="button" disabled/);
      assert(html.includes(route.startsWith('/ar') ? 'واتساب غير متاح' : 'WhatsApp unavailable'));
      continue;
    }
    assert(links.length >= 3, route);
    const messages = links.map(hrefMessage);
    assert(messages.every(message => route.startsWith('/ar') ? /^مرحباً/.test(message) : /^Hello,/.test(message)));
    if (route.includes('/services/')) assert.equal(new Set(messages).size, 1, 'shared service context');
    if (route.includes('/projects/')) assert.equal(new Set(messages).size, 1, 'shared project context');
    if (route.endsWith('/products')) assert.equal(new Set(messages).size, 5, 'catalogue and four product contexts');
  }
  console.log('All 26 routes and internal links passed in ' + (configured ? 'configured' : 'disabled') + ' mode.');
}

async function pageFor(browser, options) {
  const page = await browser.newPage(options);
  page.on('pageerror', error => failures.push(error.message));
  page.on('console', event => { if (event.type() === 'error') failures.push(event.text()); });
  await page.route('https://wa.me/**', route => {
    externalAttempts++;
    return route.abort();
  });
  return page;
}

async function audit(page, label) {
  await page.evaluate(axe.source);
  const violations = await page.evaluate(async () => {
    const result = await axe.run({runOnly:['wcag2a','wcag2aa','wcag21a','wcag21aa']});
    return result.violations.map(issue => [issue.id, issue.nodes.map(node => node.target)]);
  });
  assert.deepEqual(violations, [], label);
  console.log('axe passed: ' + label);
}

async function layouts(browser, locale) {
  const page = await pageFor(browser, { reducedMotion: 'reduce' });
  try {
    for (const width of [320, 375, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const route of ['', '/products', '/contact', '/services/landscaping', '/projects/villa-garden-makeover']) {
        await page.goto(base + '/' + locale + route);
        const result = await page.evaluate(() => {
          const nav = document.querySelector('.header-row').getBoundingClientRect();
          const pieces = [...document.querySelectorAll('.header-row>.brand,.desktop-nav,.header-tools')]
            .map(element => element.getBoundingClientRect()).filter(rect => rect.width).sort((a,b) => a.left - b.left);
          const fab = document.querySelector('.whatsapp-fab').getBoundingClientRect();
          return {
            fits: document.documentElement.scrollWidth <= innerWidth &&
              pieces.every((rect,i) => rect.left >= nav.left && rect.right <= nav.right && (!i || pieces[i-1].right <= rect.left)),
            widgetCorrectSide: document.dir === 'rtl' ? fab.left < 40 : innerWidth - fab.right < 40,
          };
        });
        assert.deepEqual(result, { fits: true, widgetCorrectSide: true }, locale + route + ' ' + width);
        assert.equal(await page.locator('.whatsapp-reminder').count(), 0);
        if (width === 390 && route === '/contact') await audit(page, locale + ' contact');
        if (width === 1440 && route === '') await audit(page, locale + ' home');
      }
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(base + '/' + locale + '/contact');
    assert.equal(await page.locator('.contact-whatsapp').evaluate(el => el.nextElementSibling.className), 'quote-panel');
    await page.locator('button[type=submit]').click();
    assert.equal(await page.locator('.field-error').count(), 3);
    assert.equal(await page.locator('#quote-location').evaluate(el => el === document.activeElement), true);
    const posts = [];
    page.on('request', request => { if (request.method() === 'POST') posts.push(request.url()); });
    await page.locator('#quote-location').fill(locale === 'ar' ? 'الدوحة' : 'Doha');
    await page.locator('#quote-message').fill(locale === 'ar' ? 'ترتيب أحواض الحديقة' : 'Tidy the garden beds');
    await page.locator('#quote-consent').check();
    await page.locator('#quote-phone').fill('123');
    await page.locator('button[type=submit]').click();
    assert(await page.locator('#error-phone').isVisible());
    await page.locator('#quote-phone').clear();
    await page.locator('button[type=submit]').click();
    assert(await page.locator('.form-result').isVisible());
    assert.deepEqual(posts, []);
    assert.equal(await page.locator('.whatsapp-fab').isDisabled(), !configured);
    console.log(locale + ' layout, RTL/LTR widget placement and quote form passed.');
  } finally {
    await page.close();
  }
}

async function reminder(browser) {
  const page = await pageFor(browser, { viewport: { width: 1440, height: 900 } });
  const note = page.locator('.whatsapp-reminder');
  const fab = page.locator('.whatsapp-fab');
  try {
    await page.clock.install();
    await page.goto(base + '/en');
    await note.waitFor({ state: 'visible' });
    assert.equal(await note.locator('span').textContent(), 'Need garden care?');
    await page.clock.runFor(3100);
    assert.equal(await note.locator('span').textContent(), 'Get a quote');
    await note.hover();
    await page.clock.runFor(3500);
    assert.equal(await note.locator('span').textContent(), 'Get a quote');
    await page.mouse.move(5, 5);
    await fab.focus();
    await page.clock.runFor(3500);
    assert.equal(await note.locator('span').textContent(), 'Get a quote');
    await fab.evaluate(el => el.blur());
    await page.clock.runFor(3100);
    assert.equal(await note.locator('span').textContent(), 'Chat with our team');
    await page.clock.runFor(3100);
    assert.equal(await note.count(), 0);
    assert(await fab.isVisible());
    await page.goto(base + '/ar');
    await page.clock.runFor(100);
    assert.equal(await note.count(), 0, 'completed intro stayed collapsed across locale navigation');
    await page.evaluate(() => sessionStorage.removeItem('terra:whatsapp-intro'));
    await page.reload();
    await note.waitFor({ state: 'visible' });
    assert.equal(await note.locator('span').textContent(), 'تحتاج إلى العناية بحديقتك؟');
    await note.getByRole('button').focus();
    await page.keyboard.press('Enter');
    assert.equal(await note.count(), 0);
    assert(await fab.evaluate(el => document.activeElement === el));
    await page.locator('.desktop-nav a[href="/ar/services"]').click();
    await page.waitForURL('**/ar/services');
    assert.equal(await note.count(), 0, 'dismissal persisted');
    await page.goto(base + '/en/services/landscaping');
    assert.equal(hrefMessage(await fab.getAttribute('href')), 'Hello, I would like to ask about Landscaping.');
    await page.goto(base + '/ar/projects/villa-garden-makeover');
    assert.match(hrefMessage(await fab.getAttribute('href')), /مشروع مماثل.*تجديد حديقة فيلا/);
    await page.goto(base + '/en/products');
    const product = await page.locator('.whatsapp-product').first().getAttribute('href');
    assert.equal(hrefMessage(product), 'Hello, I would like to inquire about Soil & growing media.');
    assert(product.includes('%26'));
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(base + '/en/contact');
    await fab.waitFor({ state: 'hidden' });
    const name = await page.locator('#quote-name').boundingBox();
    const button = await fab.evaluate(el => el.getBoundingClientRect().toJSON());
    assert(name.y < button.y + button.height && name.y + name.height > button.y, 'actual form field overlaps dock');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await fab.waitFor({ state: 'visible' });
    console.log('Reminder rotation, hover/focus pause, collapse, dismissal, focus return, route context and collision avoidance passed.');
  } finally {
    await page.close();
  }
}

(async () => {
  await markup();
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const checks = await Promise.allSettled([layouts(browser, 'en'), layouts(browser, 'ar'), ...(configured ? [reminder(browser)] : [])]);
    for (const check of checks) if (check.status === 'rejected') console.error(check.reason);
    assert(checks.every(check => check.status === 'fulfilled'));
    assert.deepEqual(failures, []);
    assert.equal(externalAttempts, 0);
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
