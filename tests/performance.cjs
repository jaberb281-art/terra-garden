/* Reproducible Lighthouse lab audits; field INP needs real production traffic. */
const { join } = require('node:path');
const { pathToFileURL } = require('node:url');
const fs = require('node:fs/promises');
const base = (process.env.QA_BASE_URL || 'http://localhost:3100').replace(/\/$/, '');
const output = join('test-results', 'lighthouse');

async function run() {
  const modules = join(__dirname, '..', '.qa', 'node_modules');
  const { default: lighthouse } = await import(pathToFileURL(require.resolve(join(modules, 'lighthouse'))));
  const launcher = await import(pathToFileURL(require.resolve(join(modules, 'chrome-launcher'))));
  const { default: desktop } = await import(pathToFileURL(join(modules, 'lighthouse', 'core', 'config', 'lr-desktop-config.js')));
  await fs.mkdir(output, { recursive: true });
  const chrome = await launcher.launch({ chromePath: process.env.QA_CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', chromeFlags: ['--headless=new', '--no-sandbox'] });
  const summaries = [];
  try {
    for (const locale of ['en', 'ar']) {
      for (const mode of ['mobile', 'desktop']) {
        const result = await lighthouse(base + '/' + locale, { port: chrome.port, output: ['json', 'html'], logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'] }, mode === 'desktop' ? desktop : undefined);
        const { lhr } = result;
        const name = locale + '-' + mode;
        for (const [index, extension] of ['json', 'html'].entries()) await fs.writeFile(join(output, name + '.' + extension), result.report[index]);
        const summary = { locale, mode, fetchTime: lhr.fetchTime, version: lhr.lighthouseVersion,
          scores: Object.fromEntries(Object.entries(lhr.categories).map(([name, value]) => [name, Math.round(value.score * 100)])),
          metrics: Object.fromEntries(['largest-contentful-paint', 'first-contentful-paint', 'total-blocking-time', 'cumulative-layout-shift', 'speed-index'].map(name => [name, { value: lhr.audits[name].numericValue, unit: lhr.audits[name].numericUnit, display: lhr.audits[name].displayValue }])),
          warnings: lhr.runWarnings,
          failedAudits: Object.values(lhr.audits).filter(audit => audit.score !== null && audit.score < 1 && audit.scoreDisplayMode !== 'informative').map(audit => ({ id: audit.id, title: audit.title, display: audit.displayValue, explanation: audit.explanation })),
        };
        summaries.push(summary);
        console.log(JSON.stringify(summary));
      }
    }
  } finally {
    await chrome.kill();
    await fs.writeFile(join(output, 'summary.json'), JSON.stringify(summaries, null, 2) + '\n');
  }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
