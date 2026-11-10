const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const Module = require('node:module');

require.extensions['.ts'] = (module, file) => module._compile(ts.transpile(fs.readFileSync(file, 'utf8'), {
  module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
}), file);
const resolve = Module._resolveFilename;
Module._resolveFilename = function (name, ...args) {
  return resolve.call(this, name.startsWith('@/') ? path.resolve('src', name.slice(2)) : name, ...args);
};
const load = Module._load;
Module._load = function (name, ...args) {
  if (name === 'server-only') return {};
  return load.call(this, name, ...args);
};

process.env.NEXT_PUBLIC_SITE_URL = 'https://terra-qa.qa';
process.env.SITE_ALLOW_INDEXING = 'true';
delete process.env.NEXT_PUBLIC_SUPABASE_URL;
delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

async function run() {
  const config = require('../src/content/config.ts');
  const robots = require('../src/app/robots.ts').default;
  const sitemap = require('../src/app/sitemap.ts').default;
  assert(config.indexable);
  assert.equal((await sitemap()).length, 26);
  assert.equal(robots().sitemap, 'https://terra-qa.qa/sitemap.xml');
  for (const route of config.publicPaths) {
    for (const locale of ['en', 'ar']) {
      const result = config.metadata(locale, route, { en: 'English', ar: 'عربي' }, { en: 'Description', ar: 'وصف' });
      assert.equal(result.alternates.canonical, 'https://terra-qa.qa/' + locale + route);
      assert.equal(result.alternates.languages.en, 'https://terra-qa.qa/en' + route);
      assert.equal(result.alternates.languages.ar, 'https://terra-qa.qa/ar' + route);
      assert.equal(result.alternates.languages['x-default'], 'https://terra-qa.qa/en' + route);
      assert(result.openGraph.images[0].url.startsWith('https://terra-qa.qa/images/'));
    }
  }
  const managed = config.metadata('en', '/projects/garden', { en: 'Title', ar: 'عنوان' }, { en: 'Description', ar: 'وصف' }, '/media/project-images/example');
  assert.equal(managed.openGraph.images[0].url, 'https://terra-qa.qa/media/project-images/example');
  console.log('Verified fallback sitemap, reciprocal hreflang, canonicals, robots, and managed social image URLs.');
}
run().catch(error => { console.error(error); process.exitCode = 1; });
