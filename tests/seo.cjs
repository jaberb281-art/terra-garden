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
  const schema = require('../src/content/structured-data.ts');
  const { services } = require('../src/content/catalog.ts');
  assert(config.indexable);
  assert.equal((await sitemap()).length, config.publicPaths.length * 2);
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
  const remote = config.metadata('ar', '/projects/garden', { en: 'Title', ar: 'عنوان' }, { en: 'Description', ar: 'وصف' }, 'https://res.cloudinary.com/verified/image.webp');
  assert.equal(remote.openGraph.images[0].url, 'https://res.cloudinary.com/verified/image.webp');
  for (const source of ['//external.example/image.webp', '/\\external.example/image.webp', 'javascript:alert(1)', 'http://insecure.example/image.webp', 'https://user:secret@assets.example/image.webp']) {
    assert.equal(config.socialImageUrl(source), undefined);
    assert.equal(config.metadata('en', '', { en: 'Title', ar: 'عنوان' }, { en: 'Description', ar: 'وصف' }, source).openGraph.images[0].url, 'https://terra-qa.qa/images/hero.webp');
  }
  for (const candidate of [undefined, '', 'not a URL', 'http://terra-qa.qa', 'https://example.com', 'https://localhost', 'https://preview.local', 'https://127.0.0.1', 'https://terra-qa.qa:8443', 'https://terra-qa.qa/en', 'https://terra-qa.qa?preview=1', 'https://user:secret@terra-qa.qa']) {
    assert.equal(config.verifiedOrigin(candidate), undefined, candidate);
  }
  assert.equal(config.verifiedOrigin('https://terra-qa.qa/'), 'https://terra-qa.qa');

  for (const locale of ['en', 'ar']) {
    const service = services[0];
    const page = { locale, path: '/services/' + service.slug, title: service.title, description: service.summary, breadcrumbTitle: service.title, service };
    const breadcrumbs = schema.pageBreadcrumbs(page);
    assert.equal(breadcrumbs.length, 3);
    assert.equal(breadcrumbs[0].href, '/' + locale);
    assert.equal(breadcrumbs[1].href, '/' + locale + '/services');
    assert.equal(breadcrumbs[2].name, service.title[locale]);
    const data = schema.pageStructuredData(page);
    const serviceData = data['@graph'].find(entry => entry['@type'] === 'Service');
    assert.equal(serviceData.name, service.title[locale]);
    assert.equal(serviceData.provider['@id'], 'https://terra-qa.qa/#organization');
    const breadcrumbData = data['@graph'].find(entry => entry['@type'] === 'BreadcrumbList');
    assert.equal(breadcrumbData.itemListElement.length, 3);
    assert.equal(breadcrumbData.itemListElement[2].item, 'https://terra-qa.qa/' + locale + page.path);
    const organization = data['@graph'].find(entry => entry['@type'] === 'Organization');
    assert.equal(organization.telephone, '+97470280176');
    assert.equal(organization.email, 'info.qatargardening@gmail.com');
    assert.equal(organization.address, undefined);
    assert.equal(organization.aggregateRating, undefined);
    assert.equal(organization.openingHours, undefined);
    assert.equal(schema.pageBreadcrumbs({ ...page, path: '' }).length, 0);
  }
  assert(!schema.serializeStructuredData({ '@context': 'https://schema.org', '@graph': [{ name: '</script><script>alert(1)</script>' }] }).includes('<'));

  // Language preference affects only the unlocalized entry point and is never a shared cache redirect.
  const { NextRequest } = require('next/server');
  const root = require('../src/app/route.ts').GET;
  for (const [preference, expected] of [['', 'en'], ['en', 'en'], ['ar', 'ar'], ['../../admin', 'en']]) {
    const response = root(new NextRequest('https://terra-qa.qa/?utm_source=example', { headers: preference ? { cookie: 'ab-gardening-locale=' + preference } : {} }));
    assert.equal(response.status, 307);
    assert.equal(response.headers.get('location'), 'https://terra-qa.qa/' + expected + '?utm_source=example');
    assert.equal(response.headers.get('cache-control'), 'private, no-store');
    assert.equal(response.headers.get('vary'), 'Cookie');
  }
  const nextConfig = require('../next.config.ts').default;
  const rules = await nextConfig.headers();
  const headers = Object.fromEntries(rules[0].headers.map(header => [header.key, header.value]));
  assert.equal(headers['X-Content-Type-Options'], 'nosniff');
  assert.equal(headers['X-Frame-Options'], 'SAMEORIGIN');
  assert.equal(headers['Referrer-Policy'], 'strict-origin-when-cross-origin');
  assert(!headers['Content-Security-Policy']);
  assert(nextConfig.images.deviceSizes.includes(320));
  assert(nextConfig.images.imageSizes.every(size => size < Math.min(...nextConfig.images.deviceSizes)));

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
    assert.equal(entries.length, config.publicPaths.length * 2 + 2);
    for (const locale of ['en','ar']) assert(entries.some(entry => entry.url.endsWith('/' + locale + '/projects/managed-example')));
  } finally { global.fetch = realFetch; }
  // An unconfirmed origin must never leak "undefined" canonicals or public indexing.
  for (const [siteOrigin, allowIndexing] of [['', 'true'], ['https://example.com', 'true'], ['https://terra-qa.qa', 'false']]) {
    process.env.NEXT_PUBLIC_SITE_URL = siteOrigin;
    process.env.SITE_ALLOW_INDEXING = allowIndexing;
    for (const file of ['../src/content/config.ts', '../src/app/robots.ts', '../src/app/sitemap.ts', '../src/content/structured-data.ts']) delete require.cache[require.resolve(file)];
    const preview = require('../src/content/config.ts');
    const previewRobots = require('../src/app/robots.ts').default;
    const previewSitemap = require('../src/app/sitemap.ts').default;
    assert.equal(preview.indexable, false);
    assert.deepEqual(await previewSitemap(), []);
    assert.equal(previewRobots().rules.disallow, '/');
    const result = preview.metadata('en', '', { en: 'Title', ar: 'عنوان' }, { en: 'Description', ar: 'وصف' });
    assert.equal(result.robots.index, false);
    assert.equal(result.robots.follow, false);
    if (!preview.origin) {
      assert.equal(result.alternates, undefined);
      assert.equal(result.openGraph.images, undefined);
      assert.equal(preview.languageUrls(''), undefined);
      assert.equal(require('../src/content/structured-data.ts').pageStructuredData({ locale: 'en', path: '', title: { en: 'Home' }, description: { en: 'Description' } }), undefined);
    }
  }
  console.log('Verified sitemap discovery, localized canonicals/hreflang, indexing gates, social images, schemas, language redirect, and security headers.');
}
run().catch(error => { console.error(error); process.exitCode = 1; });
