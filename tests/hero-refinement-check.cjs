const assert = require('node:assert/strict');
const { join } = require('node:path');
const fs = require('node:fs/promises');
const modules = join(__dirname, '..', '.qa', 'node_modules');
const { chromium } = require(join(modules,'playwright-core'));
const axe = require(join(modules,'axe-core'));
const base = 'http://localhost:3100';
const out = 'test-results/hero-refinement';
const widths = [320, 390, 768, 1024, 1440];
const locales = ['en','ar'];
const slugs = ['villa-garden-makeover','outdoor-living-renewal','farm-landscape-care'];
const errors = [];

async function pageFor(browser, options) {
  const page = await browser.newPage(options);
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', entry => { if (entry.type() === 'error') errors.push(entry.text()); });
  page.on('response', response => {
    if (response.status() >= 400 && !response.url().endsWith('/favicon.ico')) errors.push(response.status() + ' ' + response.url());
  });
  return page;
}

async function accessibility(page, label) {
  await page.evaluate(axe.source);
  const issues = await page.evaluate(async () => {
    const result = await axe.run({runOnly:['wcag2a','wcag2aa','wcag21a','wcag21aa']});
    return result.violations.map(issue => [issue.id, issue.nodes.map(node => node.target)]);
  });
  assert.deepEqual(issues, [], label);
  console.log('axe passed: ' + label);
}

async function layouts(browser, locale) {
  const page = await pageFor(browser, { reducedMotion: 'reduce' });
  try {
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(base + '/' + locale);
      await page.locator('.hero-photo img').first().evaluate(async img => { await img.decode(); await document.fonts.ready; });
      const visual = await page.evaluate(() => {
        const rect = selector => document.querySelector(selector).getBoundingClientRect();
        const overlap = (a,b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
        const headingsFit = [...document.querySelectorAll('h1,h2,h3,.showcase-link,.showcase-selectors button')]
          .filter(e=>!e.classList.contains('sr-only')).every(e => e.scrollWidth <= e.clientWidth + 1);
        const heroImage = document.querySelector('.hero-photo img');
        return {
          overflow: document.documentElement.scrollWidth > innerWidth,
          heroOverlap: overlap(rect('.hero-content'), rect('.hero-photo')),
          metaOverlap: overlap(rect('.showcase-project'), rect('.showcase-link')),
          headingsFit,
          placement: document.querySelector('.services-section').nextElementSibling.className,
          heroSource: heroImage.currentSrc,
          heroWidth: heroImage.naturalWidth,
          lazy: heroImage.loading === 'lazy',
          sliders: document.querySelectorAll('input[type=range]').length,
          heroSlider: !!document.querySelector('.hero input[type=range]'),
        };
      });
      assert.deepEqual([visual.overflow,visual.heroOverlap,visual.metaOverlap,visual.headingsFit], [false,false,false,true], locale+' '+width);
      assert.match(visual.placement, /transformations/);
      assert.match(visual.heroSource, /\/_next\/image\?url=%2Fimages%2Fhero\.webp&w=\d+/);
      assert(visual.heroWidth > 0);
      assert.equal(visual.lazy, false);
      assert.equal(visual.sliders, 1);
      assert.equal(visual.heroSlider, false);
      assert.equal(await page.locator('.hero .actions a').getAttribute('href'), '/' + locale + '/projects');
      assert(await page.locator('.hero .actions button').isDisabled());
      assert.equal(await page.locator('.showcase-selectors button').count(), 3);
      assert.equal(await page.locator('.showcase-autoplay').count(), 0);
      if ([390,1440].includes(width)) {
        await page.evaluate(async () => {
          for (const img of document.images) img.loading = 'eager';
          await Promise.allSettled([...document.images].map(img => img.decode()));
        });
        await page.screenshot({path:out+'/'+locale+'-home-'+width+'.png',fullPage:true});
        await page.locator('.transformations').screenshot({path:out+'/'+locale+'-comparison-'+width+'.png'});
        await accessibility(page, locale + ' ' + width);
      }
    }
    const selectors = page.locator('.showcase-selectors button');
    const slider = page.getByRole('slider');
    const link = page.locator('.showcase-link');
    await page.clock.install();
    await page.locator('.showcase-stage').scrollIntoViewIfNeeded();
    await page.clock.runFor(6500);
    assert.match(await link.getAttribute('href'), /villa-garden-makeover$/);
    await slider.focus();
    await page.keyboard.press('End');
    assert.equal(await slider.inputValue(), '100');
    await page.keyboard.press('Home');
    await page.keyboard.press('ArrowRight');
    assert.equal(await slider.inputValue(), '1');
    for (let index = 1; index < 3; index++) {
      await selectors.nth(index).focus();
      await page.keyboard.press('Enter');
      assert.equal(await selectors.nth(index).getAttribute('aria-pressed'), 'true');
      assert.equal(await slider.inputValue(), '50');
      const href = await link.getAttribute('href');
      assert.equal(href, '/' + locale + '/projects/' + slugs[index]);
      assert.equal((await page.request.get(base + href)).status(), 200);
    }
    await link.click();
    await page.waitForURL('**/' + locale + '/projects/farm-landscape-care');
    assert.equal(await page.getByRole('slider').inputValue(), '50');
    console.log(locale + ' layout, photo optimization, manual selection, reduced motion, keyboard and project links passed.');
  } finally { await page.close(); }
}

async function automatic(browser) {
  const page = await pageFor(browser, { viewport:{width:1440,height:900} });
  const slider = page.getByRole('slider');
  const link = page.locator('.showcase-link');
  const active = async () => (await link.getAttribute('href')).split('/').at(-1);
  const waitForProject = slug => page.locator(`.showcase-link[href$="/${slug}"]`).waitFor({ timeout: 5000 });
  try {
    await page.clock.install();
    await page.goto(base + '/en');
    await page.clock.runFor(3500);
    assert.equal(await active(), slugs[0], 'offscreen slides stay still');
    await page.locator('.showcase-stage').scrollIntoViewIfNeeded();
    // Intersection observers run on the browser's rendering schedule.
    await page.waitForTimeout(1500);
    assert.equal(await active(), slugs[0]);
    await waitForProject(slugs[1]);
    await waitForProject(slugs[2]);
    await waitForProject(slugs[0]);

    await slider.hover();
    await page.clock.runFor(3500);
    assert.equal(await active(), slugs[0], 'hover pause');
    await page.mouse.move(10,10);
    await slider.focus();
    await page.keyboard.press('End');
    await page.clock.runFor(3500);
    assert.equal(await active(), slugs[0], 'focus pause');
    assert.equal(await slider.inputValue(), '100');
    await slider.evaluate(el => el.blur());

    const box = await slider.boundingBox();
    await page.mouse.move(box.x + box.width*.5, box.y+box.height*.5);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width*.73, box.y+box.height*.5, {steps:5});
    assert(Math.abs(Number(await slider.inputValue()) - 73) < 4, 'mouse drag changes the split');
    await page.mouse.move(10,10);
    await slider.evaluate(el => el.blur());
    await page.clock.runFor(3500);
    assert.equal(await active(), slugs[0], 'drag held outside keeps the project');
    await page.mouse.up();
    await page.clock.runFor(3100);
    await waitForProject(slugs[1]);
    assert.equal(await slider.inputValue(), '50', 'new project starts centered');

    const pause = page.locator('.showcase-autoplay');
    await pause.focus();
    assert((await pause.boundingBox()).height >= 44, 'pause control is shown on keyboard focus');
    await page.keyboard.press('Enter');
    assert.match(await pause.textContent(), /Resume/);
    await pause.evaluate(el => el.blur());
    await page.clock.runFor(6500);
    assert.equal(await active(), slugs[1], 'explicit keyboard pause persists');
    await pause.focus();
    await page.keyboard.press('Enter');
    await pause.evaluate(el => el.blur());
    await page.clock.runFor(3100);
    await waitForProject(slugs[2]);
    console.log('Autoplay, 50% reset, mouse drag, hover/focus and keyboard pause/resume passed.');
  } finally { await page.close(); }
}

async function touch(browser) {
  const page = await pageFor(browser, { viewport:{width:390,height:844}, isMobile:true, hasTouch:true });
  try {
    await page.clock.install();
    await page.goto(base+'/ar');
    const stage = page.locator('.showcase-stage');
    await stage.scrollIntoViewIfNeeded();
    const slider = page.getByRole('slider');
    const box = await slider.boundingBox();
    const session = await page.context().newCDPSession(page);
    const point = {x:box.x+box.width*.5, y:box.y+box.height*.5};
    await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point]});
    await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{...point,x:box.x+box.width*.72}]});
    assert(Math.abs(Number(await slider.inputValue()) - 72) < 5, 'touch drag changes split');
    await page.clock.runFor(3600);
    assert.match(await page.locator('.showcase-link').getAttribute('href'), /villa-garden-makeover$/);
    await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
    await slider.evaluate(el => el.blur());
    await page.clock.runFor(3100);
    assert.match(await page.locator('.showcase-link').getAttribute('href'), /outdoor-living-renewal$/);
    assert.equal(await slider.inputValue(), '50');
    console.log('Arabic touch drag pauses rotation and resumes with the centered split.');
  } finally { await page.close(); }
}

(async () => {
  await fs.mkdir(out,{recursive:true});
  const browser = await chromium.launch({channel:'chrome',headless:true});
  try {
    // Autoplay pauses in background tabs, so exercise one page at a time.
    await automatic(browser);
    await touch(browser);
    for (const locale of locales) await layouts(browser, locale);
    assert.deepEqual(errors, []);
    console.log('Passed ten homepage layout checks and interaction tests with no browser errors.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
