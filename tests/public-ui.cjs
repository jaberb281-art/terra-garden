/* Optional QA dependencies stay in .qa; these tests never send external enquiries. */
const assert = require('node:assert/strict');
const { join } = require('node:path');
const fs = require('node:fs/promises');
const base = (process.env.QA_BASE_URL || 'http://localhost:3100').replace(/\/$/, '');
const output = join('test-results', 'public-ui');
const locales = ['en', 'ar'];
const widths = (process.env.QA_WIDTHS || '320,360,375,390,414,430,480,600,768,820,834,1024,1280,1440,1536,1920,2560').split(',').map(Number);
const services = ['garden-maintenance', 'grass-cutting', 'date-palm-tree-care', 'landscape-design', 'irrigation-systems', 'grass-plantation', 'soil-fertilization', 'garden-cleaning', 'indoor-plants'];
const projects = ['villa-garden-makeover', 'outdoor-living-renewal', 'farm-landscape-care'];
const paths = ['', '/services', '/projects', '/about', '/contact', ...services.map(slug => '/services/' + slug), ...projects.map(slug => '/projects/' + slug)];
const number = process.env.QA_WHATSAPP_NUMBER || '97439982513';

function whatsapp(href, locale) {
  const url = new URL(href);
  assert.equal(url.origin, 'https://wa.me');
  assert.equal(url.pathname, '/' + number);
  assert.deepEqual([...url.searchParams.keys()], ['text']);
  const message = url.searchParams.get('text');
  assert(locale === 'ar' ? /^مرحباً/.test(message) : /^Hello,/.test(message), 'Localized WhatsApp draft');
  return message;
}

async function routeChecks() {
  const links = new Set();
  const root = await fetch(base, { redirect: 'manual' });
  assert.equal(root.status, 307, 'Language-aware entry URL uses a temporary redirect');
  assert.equal(new URL(root.headers.get('location'), base).pathname, '/en');
  assert.match(root.headers.get('cache-control'), /private.*no-store/);
  assert.match(root.headers.get('vary'), /Cookie/i);
  for (const [preference, expected] of [['ar', '/ar'], ['en', '/en'], ['unsupported', '/en']]) {
    const redirect = await fetch(base, { redirect: 'manual', headers: { Cookie: 'ab-gardening-locale=' + preference } });
    assert.equal(new URL(redirect.headers.get('location'), base).pathname, expected, 'Remember explicit locale only');
  }
  for (const locale of locales) {
    for (const path of paths) {
      const route = '/' + locale + path;
      const response = await fetch(base + route);
      assert.equal(response.status, 200, route);
      assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
      assert.equal(response.headers.get('x-frame-options'), 'SAMEORIGIN');
      assert.equal(response.headers.get('referrer-policy'), 'strict-origin-when-cross-origin');
      assert.equal(response.headers.get('x-powered-by'), null);
      const html = await response.text();
      assert.match(html, new RegExp('<html[^>]+lang="' + locale + '"'));
      assert.match(html, new RegExp('<html[^>]+dir="' + (locale === 'ar' ? 'rtl' : 'ltr') + '"'));
      assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, route + ' has one main heading');
      assert.match(html, /<title>[^<]+AB Gardening[^<]*<\/title>/, route + ' branded title');
      const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map(match => match[1].replaceAll('&amp;', '&'));
      const whatsappLinks = hrefs.filter(href => href.startsWith('https://wa.me/'));
      assert(whatsappLinks.length >= 2, route + ' offers WhatsApp contact');
      for (const href of whatsappLinks) whatsapp(href, locale);
      assert(hrefs.includes('tel:+97470280176'), route + ' telephone');
      assert(hrefs.includes('mailto:info.qatargardening@gmail.com'), route + ' email');
      for (const href of hrefs) if (/^\/(?:en|ar)(?:\/|$)/.test(href)) links.add(href.split(/[?#]/)[0]);
    }
    for (const path of ['/products', '/missing-check', '/services/missing-check', '/projects/missing-check']) {
      assert.equal((await fetch(base + '/' + locale + path)).status, 404, locale + path + ' is a real 404');
    }
  }
  for (const path of links) assert.equal((await fetch(base + path)).status, 200, 'Internal link ' + path);
  return { routes: paths.length * locales.length, checkedInternalLinks: links.size, missingRoutes: 8 };
}

async function ready(page) {
  await page.locator('main').waitFor();
  await page.evaluate(() => document.fonts.ready);
}

async function layout(page, label) {
  const result = await page.evaluate(() => {
    const visible = element => { const style = getComputedStyle(element); const rect = element.getBoundingClientRect(); return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0; };
    const name = element => element.tagName.toLowerCase() + (element.id ? '#' + element.id : '') + '.' + String(element.className).split(/\s/).slice(0, 2).join('.');
    const clipped = [...document.querySelectorAll('h1,h2,h3,.button,.mobile-fit-bar,.site-footer')].filter(visible).filter(element => element.scrollWidth > element.clientWidth + 2).map(name);
    const header = document.querySelector('.header-row').getBoundingClientRect();
    const pieces = [...document.querySelectorAll('.header-row>.brand,.desktop-nav,.header-tools')].filter(visible).map(element => element.getBoundingClientRect()).sort((a, b) => a.left - b.left);
    return { horizontalOverflow: document.documentElement.scrollWidth > innerWidth + 1, clippedContent: clipped,
      headerFits: pieces.every((rect, index) => rect.left >= header.left - 1 && rect.right <= header.right + 1 && (!index || pieces[index - 1].right <= rect.left + 1)) };
  });
  assert.deepEqual(result, { horizontalOverflow: false, clippedContent: [], headerFits: true }, label);
}

async function axeAudit(page, label, axe) {
  await page.evaluate(axe.source);
  const result = await page.evaluate(async () => {
    const result = await axe.run({ runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } });
    return { violations: result.violations.map(issue => ({ id: issue.id, impact: issue.impact, nodes: issue.nodes.map(node => node.target) })), incomplete: result.incomplete.map(issue => issue.id) };
  });
  assert.deepEqual(result.violations, [], label + ' automated accessibility');
  return result;
}

async function capture(page, name) {
  if (process.env.QA_SCREENSHOTS === '0') return;
  await page.evaluate(async () => { for (const image of document.images) image.loading = 'eager'; await Promise.allSettled([...document.images].map(image => image.decode())); });
  // Paint offscreen content for the exported full-page image only. Playwright
  // removes this stylesheet immediately; functional, axe and lab checks use
  // the real content-visibility behavior.
  await page.screenshot({ path: join(output, name + '.png'), fullPage: true, style: '* { content-visibility: visible !important; }' });
}

async function homeLayouts(page, locale, axe, accessibility) {
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(base + '/' + locale);
    await ready(page);
    const image = page.locator('.hero-photo img');
    await image.evaluate(image => image.decode());
    await layout(page, locale + ' home ' + width);
    assert.notEqual(await image.getAttribute('loading'), 'lazy', 'Hero is not lazy loaded');
    assert(await image.evaluate(image => image.naturalWidth > 0), 'Hero loads');
    assert.match(await image.evaluate(image => image.currentSrc), /\/_next\/image\?/);
    assert.equal(await page.locator('.hero-more').getAttribute('href'), '/' + locale + '/services');
    whatsapp(await page.locator('.hero-inquiry').getAttribute('href'), locale);
    assert.equal(await page.locator('.svc-showcase .svc-card:visible').count(), width <= 760 ? 3 : 9, 'Default homepage services at ' + width);
    if ([320, 390, 834, 1440, 1920, 2560].includes(width)) await capture(page, locale + '-home-' + width);
    if ([390, 834, 1440].includes(width) && process.env.QA_SKIP_AXE !== '1') accessibility.push({ page: locale + ' home ' + width, ...await axeAudit(page, locale + ' home ' + width, axe) });
  }
}

async function internalLayouts(page, locale, axe, accessibility) {
  for (const width of [390, 834, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ['/services', '/projects', '/about', '/contact', '/services/grass-cutting', '/projects/villa-garden-makeover']) {
      await page.goto(base + '/' + locale + path);
      await ready(page);
      await layout(page, locale + path + ' ' + width);
      if (path === '/services') for (const slug of services) assert(await page.locator('main a[href="/' + locale + '/services/' + slug + '"]').count() > 0, 'Complete service catalogue');
      if (width === 390 || width === 1440) {
        await capture(page, locale + path.replaceAll('/', '-') + '-' + width);
        if (process.env.QA_SKIP_AXE !== '1') accessibility.push({ page: locale + path + ' ' + width, ...await axeAudit(page, locale + path + ' ' + width, axe) });
      }
    }
  }
}

async function navigation(page, locale) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base + '/' + locale + '/services/grass-cutting');
  await ready(page);
  const trigger = page.locator('.mobile-nav summary');
  await trigger.focus();
  await page.keyboard.press('ArrowDown');
  assert.equal(await page.locator('.mobile-nav').getAttribute('open'), '');
  assert(await page.locator('.mobile-nav nav a').first().evaluate(link => link === document.activeElement));
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('.mobile-nav').getAttribute('open'), null);
  assert(await trigger.evaluate(element => element === document.activeElement));
  await trigger.click();
  await page.mouse.click(5, 820);
  assert.equal(await page.locator('.mobile-nav').getAttribute('open'), null, 'Outside click closes navigation');
  await trigger.click();
  await page.locator('.mobile-nav a[href="/' + locale + '/contact"]').click();
  await page.waitForURL('**/' + locale + '/contact');
  assert.equal(await page.locator('.mobile-nav').getAttribute('open'), null, 'Navigation closes menu');
  const language = page.locator('.language');
  await language.focus();
  await page.keyboard.press('ArrowDown');
  assert.equal(await language.getAttribute('aria-expanded'), 'true');
  await page.keyboard.press('Escape');
  assert(await language.evaluate(element => element === document.activeElement));
  await language.click();
  const other = locale === 'ar' ? 'en' : 'ar';
  await page.locator('.language-panel a[hreflang="' + other + '"]').click();
  await page.waitForURL('**/' + other + '/contact');
  assert.equal(await page.locator('html').getAttribute('lang'), other, 'Language switch preserves page');
  assert.equal(await page.locator('html').getAttribute('dir'), other === 'ar' ? 'rtl' : 'ltr');
  assert((await page.context().cookies()).some(cookie => cookie.name === 'ab-gardening-locale' && cookie.value === other), 'Explicit language choice persists');
  await page.goto(base);
  await page.waitForURL('**/' + other);
}

async function homeInteractions(page, locale) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base + '/' + locale);
  await ready(page);
  const cards = page.locator('.svc-showcase .svc-card:visible');
  assert.equal(await cards.count(), 3);
  for (const [group, count] of [['maintain', 5], ['improve', 4]]) {
    await page.locator('label[for="svc-' + group + '"]').click();
    assert.equal(await cards.count(), count, 'Category exposes all matching services');
    assert.deepEqual(await cards.evaluateAll(elements => [...new Set(elements.map(element => element.dataset.group))]), [group]);
  }
  await page.locator('label[for="svc-all"]').click();
  const servicesToggle = page.locator('.svc-showcase .disclosure-toggle');
  await servicesToggle.click();
  assert.equal(await servicesToggle.getAttribute('aria-expanded'), 'true');
  assert.equal(await cards.count(), 9, 'Show all exposes nine services');
  await servicesToggle.click();
  assert.equal(await cards.count(), 3);
  assert.equal(await page.locator('.area-tags li:visible').count(), 6, 'Major service areas visible initially');
  const areasToggle = page.locator('.areas-disclosure .disclosure-toggle');
  await areasToggle.focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('.area-tags li:visible').count(), 18, 'All locations remain accessible');
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('.area-tags li:visible').count(), 6);
  const faq = page.locator('.home-faq details').first();
  await faq.locator('summary').focus();
  await page.keyboard.press('Enter');
  assert.equal(await faq.getAttribute('open'), '');
  assert(await faq.locator('p').isVisible());
  await page.keyboard.press('Enter');
  assert.equal(await faq.getAttribute('open'), null);
  const slider = page.locator('.showcase-stage input[type=range]');
  await slider.focus();
  await page.keyboard.press('End');
  assert.equal(await slider.inputValue(), '100');
  await page.keyboard.press('Home');
  await page.keyboard.press('ArrowRight');
  assert.equal(await slider.inputValue(), '1', 'Physical slider direction is consistent in RTL');
  assert(await slider.getAttribute('aria-valuetext'));
  const selectors = page.locator('.showcase-selectors button');
  for (let index = 0; index < projects.length; index++) {
    await selectors.nth(index).click();
    assert.equal(await selectors.nth(index).getAttribute('aria-pressed'), 'true');
    if (index > 0) assert.equal(await slider.inputValue(), '50', 'New comparison starts centered');
    assert.equal(await page.locator('.showcase-link').getAttribute('href'), '/' + locale + '/projects/' + projects[index]);
  }
  const actions = page.locator('.showcase-stage .compare-actions button');
  for (const [index, value] of ['100', '50', '0'].entries()) { await actions.nth(index).click(); assert.equal(await slider.inputValue(), value); }
  assert.equal(await page.locator('.showcase-autoplay').count(), 0, 'Comparison is manual');
  await page.locator('.showcase-link').click();
  await page.waitForURL('**/' + locale + '/projects/' + projects.at(-1));
  const photo = page.locator('.gallery>button').first();
  await photo.click();
  assert(await page.locator('dialog[open]').isVisible());
  await page.keyboard.press('Escape');
  assert(await photo.evaluate(element => element === document.activeElement), 'Gallery returns focus');
}

async function touchComparison(browser, locale) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await context.newPage();
  try {
    await page.goto(base + '/' + locale);
    const slider = page.locator('.showcase-stage input[type=range]');
    await slider.scrollIntoViewIfNeeded();
    const box = await slider.boundingBox();
    const session = await context.newCDPSession(page);
    const point = { x: box.x + box.width * .5, y: box.y + box.height * .5 };
    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [point] });
    await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ ...point, x: box.x + box.width * .75 }] });
    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    assert(Math.abs(Number(await slider.inputValue()) - 75) < 6, 'Touch adjusts comparison');
    const before = await page.evaluate(() => scrollY);
    const current = await slider.boundingBox();
    const start = { x: current.x + current.width * .5, y: current.y + current.height * .5 };
    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [start] });
    for (let step = 1; step <= 5; step++) await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ ...start, y: start.y - step * 25 }] });
    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await page.waitForTimeout(150);
    assert(await page.evaluate(() => scrollY) > before + 20, 'Vertical touch scrolls normally');
  } finally { await context.close(); }
}

async function internalInteractions(page, locale) {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(base + '/' + locale + '/projects');
    await ready(page);
    const filters = page.locator('#project-gallery .mobile-fit-bar button');
    for (let index = 1; index <= 3; index++) {
      await filters.nth(index).click();
      assert.equal(await filters.nth(index).getAttribute('aria-pressed'), 'true');
      assert.equal(await page.locator('#project-gallery article').count(), 1);
      assert.equal(await page.locator('#project-gallery article h3 a').getAttribute('href'), '/' + locale + '/projects/' + projects[index - 1]);
    }
    await filters.first().click();
    assert.equal(await page.locator('#project-gallery article').count(), 3);
    for (const [path, hashes] of [['/projects', ['project-gallery']], ['/services', ['service-directory', 'maintain', 'improve']]]) {
      await page.goto(base + '/' + locale + path);
      await ready(page);
      for (const hash of hashes) {
        await page.locator('a[href="#' + hash + '"]').click();
        await page.waitForFunction(id => location.hash === '#' + id, hash);
        const position = await page.locator('#' + hash).evaluate(element => ({ top: element.getBoundingClientRect().top, headerBottom: document.querySelector('.site-header').getBoundingClientRect().bottom }));
        assert(position.top >= position.headerBottom - 1, locale + path + '#' + hash + ' clears the sticky navigation at ' + width);
      }
    }
  }
  await page.goto(base + '/' + locale);
  const slider = page.locator('.showcase-stage input[type=range]');
  await slider.scrollIntoViewIfNeeded();
  const box = await slider.boundingBox();
  await page.mouse.move(box.x + box.width * .5, box.y + box.height * .5);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * .72, box.y + box.height * .5, { steps: 5 });
  await page.mouse.up();
  assert(Math.abs(Number(await slider.inputValue()) - 72) < 5, 'Mouse dragging adjusts the comparison in either locale');
}

async function contact(page, locale) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base + '/' + locale + '/contact');
  await ready(page);
  await page.evaluate(() => { window.__qaOpened = []; window.open = (...args) => { window.__qaOpened.push(args); return null; }; });
  const posts = [];
  const onRequest = request => { if (request.method() === 'POST') posts.push(request.url()); };
  page.on('request', onRequest);
  try {
    await page.locator('.quote-form button[type=submit]').click();
    assert.equal(await page.locator('.field-error').count(), 2);
    assert(await page.locator('#quote-location').evaluate(element => element === document.activeElement));
    await page.locator('#quote-location').fill(locale === 'ar' ? 'الدوحة' : 'Doha');
    const text = locale === 'ar' ? 'تنظيف الحديقة & فحص الري + إضافة نباتات' : 'Garden tidy & irrigation check + planting';
    await page.locator('#quote-message').fill(text);
    await page.locator('#quote-phone').fill('123');
    await page.locator('.quote-form button[type=submit]').click();
    assert(await page.locator('#error-phone').isVisible());
    await page.locator('#quote-phone').fill(locale === 'ar' ? '+٩٧٤ ٧٠٢٨ ٠١٧٦' : '+974 7028 0176');
    await page.locator('#quote-service').selectOption('grass-cutting');
    await page.locator('.quote-form button[type=submit]').click();
    assert(await page.locator('.form-result').isVisible());
    const calls = await page.evaluate(() => window.__qaOpened);
    assert.equal(calls.length, 1, 'One reviewable handoff');
    assert.equal(calls[0][1], '_blank');
    assert.match(calls[0][2], /noopener/);
    assert.match(calls[0][2], /noreferrer/);
    const message = whatsapp(calls[0][0], locale);
    assert(message.includes(text), 'Special characters survive URL encoding');
    assert(message.includes(locale === 'ar' ? 'قص العشب' : 'Grass cutting'), 'Service context is preserved');
    assert.deepEqual(posts, [], 'Form does not send entries to a server');
    await page.locator('.site-footer').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector('.whatsapp-widget')?.dataset.blocked === 'true');
    assert.equal(await page.locator('.site-footer a[href^="https://wa.me/"]').count(), 1);
  } finally { page.off('request', onRequest); }
}

async function run({ scope = 'all' } = {}) {
  const modules = join(__dirname, '..', '.qa', 'node_modules');
  const { chromium } = require(join(modules, 'playwright-core'));
  const axe = require(join(modules, 'axe-core'));
  await fs.mkdir(output, { recursive: true });
  const report = { base, scope, widths, started: new Date().toISOString(), screenshotNote: 'Full-page captures temporarily paint offscreen content; functional, accessibility and Lighthouse checks use normal content-visibility.', checks: [], browserErrors: [], accessibility: [] };
  async function check(name, task) {
    try { const detail = await task(); report.checks.push({ name, passed: true, detail }); console.log('PASS ' + name); }
    catch (error) { report.checks.push({ name, passed: false, error: error.stack || String(error) }); console.error('FAIL ' + name + '\n' + error.stack); }
  }
  await check('Public routes, localized contacts and internal links', routeChecks);
  const browser = await chromium.launch({ ...(process.env.QA_CHROME_PATH ? { executablePath: process.env.QA_CHROME_PATH } : { channel: 'chrome' }), headless: true });
  try {
    for (const locale of locales) {
      const context = await browser.newContext({ reducedMotion: 'reduce' });
      const page = await context.newPage();
      page.on('pageerror', error => report.browserErrors.push({ locale, type: 'pageerror', message: error.message }));
      page.on('console', entry => { if (entry.type() === 'error') report.browserErrors.push({ locale, type: 'console', message: entry.text() }); });
      page.on('response', response => { if (response.status() >= 400 && !response.url().endsWith('/favicon.ico')) report.browserErrors.push({ locale, type: 'http', message: response.status() + ' ' + response.url() }); });
      if (['all', 'hero'].includes(scope)) {
        await check(locale + ' homepage responsive matrix', () => homeLayouts(page, locale, axe, report.accessibility));
        await check(locale + ' filters, areas, FAQ, comparison and gallery', () => homeInteractions(page, locale));
        await check(locale + ' touch comparison and page scrolling', () => touchComparison(browser, locale));
      }
      if (scope === 'all') await check(locale + ' internal pages responsive matrix', () => internalLayouts(page, locale, axe, report.accessibility));
      if (['all', 'interactions'].includes(scope)) await check(locale + ' project filters and unobscured anchors', () => internalInteractions(page, locale));
      await check(locale + ' mobile menu and language switching', () => navigation(page, locale));
      if (['all', 'contact'].includes(scope)) await check(locale + ' quote validation, handoff and footer', () => contact(page, locale));
      await context.close();
    }
    await check('No browser console, runtime or HTTP errors', async () => assert.deepEqual(report.browserErrors, []));
  } finally {
    await browser.close();
    report.finished = new Date().toISOString();
    report.passed = report.checks.every(check => check.passed);
    await fs.writeFile(join(output, 'results-' + scope + '.json'), JSON.stringify(report, null, 2) + '\n');
  }
  assert(report.passed, 'Public UI checks failed; inspect ' + join(output, 'results-' + scope + '.json'));
  console.log('Public UI checks passed. Automated axe checks supplement manual review and do not establish full WCAG conformance.');
  return report;
}
module.exports = { run };
if (require.main === module) run().catch(error => { console.error(error); process.exitCode = 1; });
