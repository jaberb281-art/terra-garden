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

  // Exercise sitemap additions independently of launch indexing settings.
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://127.0.0.1:54419';
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_seo_fixture';
  process.env.CLOUDINARY_CLOUD_NAME = 'terra-test-fixture';
  process.env.CLOUDINARY_API_KEY = 'fixture';
  process.env.CLOUDINARY_API_SECRET = 'fixture';
  const realFetch = global.fetch;
  global.fetch = async input => {
    const url = new URL(input);
    assert.equal(url.origin, 'http://127.0.0.1:54419');
    assert.equal(url.searchParams.get('status'), 'eq.published');
    const id = '30000000-0000-4000-8000-000000000011';
    const title = { en: 'Managed example', ar: 'مثال اختباري' };
    return Response.json([{
      id, slug: 'managed-example', category: 'villas', title, description: title,
      story: { challenge: title, approach: title, outcome: title }, location: title,
      related_services: [], provenance: 'authentic', seo_title: title, seo_description: title,
      project_images: ['before', 'after'].map((role, index) => ({
        id: '30000000-0000-4000-8000-00000000001' + (index + 2),
        project_id: id, role, public_id: 'terra/projects/' + id + '/' + role + '/30000000-0000-4000-8000-000000000099',
        width: 640, height: 480, alt: title, sort_order: index,
      })),
    }]);
  };
  try {
    const entries = await sitemap();
    assert.equal(entries.length, 28);
    for (const locale of ['en','ar']) assert(entries.some(entry => entry.url.endsWith('/' + locale + '/projects/managed-example')));
  } finally { global.fetch = realFetch; }
  console.log('Verified fallback and managed sitemap entries, hreflang, canonicals, robots, and managed social image URLs.');
}
run().catch(error => { console.error(error); process.exitCode = 1; });
