const assert = require('node:assert/strict');
const { randomUUID, createHmac } = require('node:crypto');
const { spawn } = require('node:child_process');
const { createServer } = require('node:http');
const { mkdir, readFile } = require('node:fs/promises');
const { chromium } = require('../.qa/node_modules/playwright-core');

const base = 'http://127.0.0.1:3101';
const supabase = 'http://127.0.0.1:54419';
const output = 'test-results/admin-cms';
const owner = { id: '30000000-0000-4000-8000-000000000001', email: 'owner@example.invalid', role: 'authenticated', aud: 'authenticated' };
const visitor = { ...owner, id: '30000000-0000-4000-8000-000000000002', email: 'visitor@example.invalid' };
const pair = (en, ar) => ({ en, ar });
const empty = pair('', '');
const projects = [];
const images = [];
const service = {
  slug: 'grass-cutting', title: pair('Grass cutting', 'قص العشب'),
  summary: pair('Lawn and edging care', 'العناية بالعشب والحواف'),
  detail: pair('Care for an existing lawn.', 'العناية بالمسطح العشبي القائم.'),
  scope: [pair('Mowing', 'قص العشب')], image: 'villa-after', image_alt: pair('Lawn', 'مسطح عشبي'),
  seo_title: empty, seo_description: empty, status: 'published', sort_order: 0, updated_at: new Date().toISOString(),
  service_faqs: [{ id: randomUUID(), question: pair('What is included?', 'ما نطاق العمل؟'), answer: pair('Lawn care.', 'العناية بالعشب.'), sort_order: 0 }],
};

function jwt(user) {
  const encode = value => Buffer.from(JSON.stringify(value)).toString('base64url');
  const unsigned = encode({ alg: 'HS256', typ: 'JWT' }) + '.' + encode({
    sub: user.id, aud: 'authenticated', role: 'authenticated',
    iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 3600,
  });
  return unsigned + '.' + createHmac('sha256', 'local-browser-test-fixture').update(unsigned).digest('base64url');
}

function identity(request) {
  try {
    const token = request.headers.authorization?.split(' ')[1];
    const [header, claims, signature] = token.split('.');
    if (createHmac('sha256', 'local-browser-test-fixture').update(header + '.' + claims).digest('base64url') !== signature) return null;
    const { sub } = JSON.parse(Buffer.from(claims, 'base64url').toString());
    return [owner, visitor].find(user => user.id === sub);
  } catch { return null; }
}

function json(response, status, value, headers = {}) {
  response.writeHead(status, { 'Content-Type': 'application/json', ...headers });
  response.end(value === undefined ? undefined : JSON.stringify(value));
}

async function input(request) {
  let body = '';
  for await (const chunk of request) body += chunk;
  return body ? JSON.parse(body) : {};
}

function match(row, params) {
  for (const key of ['id', 'slug', 'status', 'category', 'project_id', 'updated_at']) {
    const value = params.get(key);
    if (value?.startsWith('eq.') && String(row[key]) !== value.slice(3)) return false;
  }
  const search = params.get('search_text');
  return !search || [row.slug, row.title.en, row.title.ar].join(' ').toLowerCase().includes(search.slice(7, -1).toLowerCase());
}

function list(request, response, rows) {
  if (request.method === 'HEAD') {
    response.writeHead(200, { 'Content-Range': rows.length ? '0-' + (rows.length - 1) + '/' + rows.length : '*/0' });
    return response.end();
  }
  const headers = { 'Content-Range': rows.length ? '0-' + (rows.length - 1) + '/' + rows.length : '*/0' };
  return json(response, 200, request.headers.accept?.includes('vnd.pgrst.object') ? rows[0] ?? null : rows, headers);
}

const backend = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, supabase);
    const user = identity(request);
    const admin = user?.id === owner.id;
    const method = request.method;

    if (url.pathname === '/auth/v1/token' && method === 'POST') {
      const fields = await input(request);
      const account = [owner, visitor].find(person => person.email === fields.email);
      if (!account || fields.password !== 'fixture-password-only') return json(response, 400, { code: 'invalid_credentials', msg: 'Invalid login credentials' });
      return json(response, 200, { access_token: jwt(account), refresh_token: 'fixture-refresh-' + account.id, token_type: 'bearer', expires_in: 3600, user: account });
    }
    if (url.pathname === '/auth/v1/user') return user ? json(response, 200, user) : json(response, 401, { msg: 'Invalid session' });
    if (url.pathname === '/auth/v1/logout') return json(response, 204);
    const resource = url.pathname.replace('/rest/v1/', '');
    if (resource === 'admin_profiles') return list(request, response, admin ? [{ role: 'owner', active: true }] : []);
    if (method === 'GET' || method === 'HEAD') {
      if (resource === 'projects') {
        return list(request, response, projects.filter(row => (admin || row.status === 'published') && match(row, url.searchParams))
          .map(row => ({ ...row, project_images: images.filter(image => image.project_id === row.id) })));
      }
      if (resource === 'project_images') return list(request, response, images.filter(image =>
        (admin || projects.some(row => row.id === image.project_id && row.status === 'published')) && match(image, url.searchParams)));
      if (resource === 'services') return list(request, response, (admin || service.status === 'published') && match(service, url.searchParams) ? [service] : []);
    }
    if (!admin) return json(response, 403, { code: '42501', message: 'Fixture access denied' });
    if (resource === 'projects' && method === 'POST') {
      const row = { ...(await input(request)), id: randomUUID(), status: 'draft', updated_at: new Date().toISOString(), published_at: null };
      projects.push(row);
      return list(request, response, [row]);
    }
    if (resource === 'projects' && method === 'PATCH') {
      const fields = await input(request);
      const row = projects.find(project => match(project, url.searchParams));
      if (!row) return list(request, response, []);
      Object.assign(row, fields, { updated_at: new Date().toISOString() });
      if (row.status === 'published') row.published_at ??= row.updated_at;
      return list(request, response, [row]);
    }
    if (resource === 'projects' && method === 'DELETE') {
      const index = projects.findIndex(project => match(project, url.searchParams));
      return list(request, response, index < 0 ? [] : projects.splice(index, 1));
    }
    if (resource === 'project_images' && method === 'PATCH') {
      const fields = await input(request);
      const row = images.find(image => match(image, url.searchParams));
      return list(request, response, row ? [Object.assign(row, fields)] : []);
    }
    if (resource === 'rpc/terra_save_service') {
      const fields = await input(request);
      Object.assign(service, fields.p_service, {
        updated_at: new Date().toISOString(),
        service_faqs: fields.p_faqs.map((faq, sort_order) => ({ id: randomUUID(), ...faq, sort_order })),
      });
      return json(response, 200, null);
    }
    return json(response, 404, { message: 'Unhandled local fixture request: ' + method + ' ' + url.pathname });
  } catch (error) {
    console.error(error);
    return json(response, 500, { message: 'Local fixture failed' });
  }
});

function fixtureImage(project, role, order) {
  return {
    id: randomUUID(), project_id: project.id, role, asset_id: randomUUID().replaceAll('-', ''),
    public_id: 'terra/projects/' + project.id + '/' + role + '/' + randomUUID(),
    width: 508, height: 508, bytes: 1000, format: 'webp', version: 1234,
    alt: pair('Fixture garden photograph', 'صورة اختبارية للحديقة'), caption: empty,
    sort_order: order, created_at: new Date().toISOString(),
  };
}

async function waitReady(server) {
  for (let i = 0; i < 60; i++) {
    if (server.exitCode !== null) throw new Error('Next fixture server exited');
    try { if ((await fetch(base + '/admin/login')).ok) return; } catch {}
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  throw new Error('Next fixture server did not start');
}

async function signIn(page, email) {
  await page.goto(base + '/admin/login');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password', { exact: true }).fill('fixture-password-only');
  await page.getByRole('button', { name: 'Sign in' }).click();
}

async function run() {
  await mkdir(output, { recursive: true });
  await new Promise((resolve, reject) => backend.listen(54419, '127.0.0.1', resolve).once('error', reject));
  const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3101'], {
    stdio: 'inherit',
    env: { ...process.env, NEXT_PUBLIC_SUPABASE_URL: supabase, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_browser_fixture',
      CLOUDINARY_CLOUD_NAME: 'terra-test-fixture', CLOUDINARY_API_KEY: 'fixture', CLOUDINARY_API_SECRET: 'fixture', SITE_ALLOW_INDEXING: 'false' },
  });
  let browser;
  try {
    await waitReady(server);
    const redirects = await fetch(base + '/admin/projects/new', { redirect: 'manual' });
    assert.equal(redirects.status, 307);
    assert.match(redirects.headers.get('location'), /\/admin\/login$/);
    browser = await chromium.launch({ channel: 'chrome' });
    const page = await browser.newPage({ viewport: { width: 1440, height: 950 }, reducedMotion: 'reduce' });
    const pageErrors = [];
    page.on('pageerror', error => pageErrors.push(error.message));
    const photo = await readFile('public/images/villa-after.webp');
    // This is a browser rendering fixture only. Do not call Cloudinary or
    // infer live upload/delivery success from the local substitute.
    await page.route(/\/media\/(?:project-images\/)?[a-f0-9-]+(?:\?w=\d+)?$/, route => route.fulfill({ contentType: 'image/webp', body: photo }));

    await signIn(page, visitor.email);
    await page.getByRole('alert').filter({ hasText: 'Sign-in failed' }).waitFor();
    await signIn(page, owner.email);
    await page.waitForURL(base + '/admin');
    await page.getByRole('heading', { name: 'Overview' }).waitFor();
    await page.screenshot({ path: output + '/fixture-overview-desktop.png', fullPage: true });
    await page.getByRole('link', { name: 'Create a project' }).click();
    await page.waitForURL('**/admin/projects/new');
    await page.locator('[name=slug]').fill('fixture-garden');
    await page.locator('[name=title_en]').fill('Garden fixture');
    await page.locator('[name=title_ar]').fill('حديقة اختبارية');
    for (const field of ['description', 'challenge', 'approach', 'outcome']) {
      await page.locator('[name=' + field + '_en]').fill('Fixture ' + field);
      await page.locator('[name=' + field + '_ar]').fill('نص اختباري');
    }
    await page.locator('[name=related_services][value=grass-cutting]').check();
    await page.getByRole('button', { name: 'Save draft' }).click();
    await page.waitForURL('**/edit?notice=created');
    const project = projects[0];
    assert.equal(project.status, 'draft');
    assert.equal((await fetch(base + '/en/projects/fixture-garden')).status, 404);

    await page.getByRole('button', { name: 'Publish project' }).click();
    await page.getByRole('alert').filter({ hasText: 'Upload both' }).waitFor();
    const uploadPath = '/admin/projects/' + project.id + '/upload';
    const invalid = new FormData();
    invalid.append('file', new Blob(['invalid'], { type: 'image/png' }), 'not-a-photo.png');
    invalid.append('role', 'before');
    invalid.append('alt_en', 'Fixture');
    invalid.append('alt_ar', 'اختبار');
    assert.equal((await page.request.post(base + uploadPath, { multipart: invalid, headers: { Origin: base } })).status(), 415);
    assert.equal((await fetch(base + uploadPath, { method: 'POST', body: invalid, headers: { Origin: base } })).status, 401);
    assert.equal((await fetch(base + uploadPath, { method: 'POST', body: invalid, headers: { Origin: 'https://example.invalid' } })).status, 403);

    const upload = page.locator('form[action$="/upload"]').first();
    await upload.locator('input[type=file]').setInputFiles('public/images/villa-after.webp');
    await upload.locator('[name=alt_en]').fill('Fixture photograph');
    await upload.locator('[name=alt_ar]').fill('صورة اختبارية');
    let attempts = 0;
    await page.route('**' + uploadPath, route => {
      attempts++;
      if (attempts === 1) return route.fulfill({ status: 502, json: { message: 'Fixture upload failure. Retry.' } });
      images.push(fixtureImage(project, 'before', 0));
      return route.fulfill({ status: 201, json: { message: 'Fixture image saved.' } });
    });
    await upload.getByRole('button', { name: 'Upload photograph' }).click();
    await upload.getByRole('alert').filter({ hasText: 'Fixture upload failure' }).waitFor();
    await upload.getByRole('button', { name: 'Upload photograph' }).click();
    await upload.getByRole('status').filter({ hasText: 'Fixture image saved' }).waitFor();
    await page.unroute('**' + uploadPath);
    images.push(fixtureImage(project, 'after', 0), fixtureImage(project, 'gallery', 20), fixtureImage(project, 'gallery', 10));
    assert.equal((await fetch(base + '/media/project-images/' + images[0].id)).status, 404);
    assert.equal((await fetch(base + '/admin/media/' + images[0].id)).status, 401);
    await page.reload();

    const galleryImage = page.locator('article').filter({ has: page.locator('input[name=image][value="' + images[2].id + '"]') });
    await galleryImage.locator('input[name=sort_order]').fill('5');
    await galleryImage.getByRole('button', { name: 'Save image details' }).click();
    await page.waitForURL('**/edit?notice=media');
    assert.equal(images[2].sort_order, 5);
    await page.locator('[name=description_en]').fill('Updated fixture project description');
    await page.getByRole('button', { name: 'Save draft' }).click();
    await page.waitForURL('**/edit?notice=saved');
    assert.equal(project.description.en, 'Updated fixture project description');
    await page.screenshot({ path: output + '/fixture-project-editor-desktop.png', fullPage: true });

    await page.getByRole('link', { name: 'Preview', exact: true }).click();
    await page.waitForURL('**/preview');
    await page.getByRole('link', { name: 'Preview Arabic' }).click();
    await page.waitForURL('**/preview?lang=ar');
    assert.equal(await page.locator('.admin-preview').getAttribute('dir'), 'rtl');
    await page.getByRole('slider').focus();
    await page.keyboard.press('End');
    assert.equal(await page.getByRole('slider').inputValue(), '100');
    await page.getByRole('link', { name: 'Back to edit' }).click();
    await page.getByRole('button', { name: 'Publish project' }).click();
    await page.waitForURL('**/edit?notice=published');
    assert.equal(project.status, 'published');
    for (const [locale, title] of [['en', 'Garden fixture'], ['ar', 'حديقة اختبارية']]) {
      await page.goto(base + '/' + locale + '/projects/fixture-garden');
      assert.equal(await page.locator('h1').textContent(), title);
      assert.equal(await page.locator('.gallery>button').count(), 4);
      assert.match(await page.locator('meta[name=robots]').getAttribute('content'), /noindex/);
      await page.goto(base + '/' + locale + '/projects');
      assert(await page.locator('a[href="/' + locale + '/projects/fixture-garden"]').isVisible());
    }
    await page.goto(base + '/en');
    assert(await page.locator('.projects-section a[href="/en/projects/fixture-garden"]').isVisible());

    await page.setViewportSize({ width: 390, height: 860 });
    await page.goto(base + '/admin/projects?q=fixture&status=published');
    await page.getByRole('heading', { name: 'Garden fixture' }).waitFor();
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.screenshot({ path: output + '/fixture-projects-mobile.png', fullPage: true });
    await page.goto(base + '/admin/services');
    await page.locator('[name=summary_en]').fill('Updated fixture service summary');
    await page.getByRole('button', { name: 'Save service' }).click();
    await page.waitForURL('**/admin/services?service=grass-cutting&notice=saved');
    await page.screenshot({ path: output + '/fixture-services-mobile.png', fullPage: true });
    await page.goto(base + '/en/services/grass-cutting');
    assert((await page.locator('main').textContent()).includes('Updated fixture service summary'));

    await page.goto(base + '/admin/projects/' + project.id + '/edit');
    await page.getByRole('button', { name: 'Unpublish project' }).click();
    await page.waitForURL('**/edit?notice=unpublished');
    assert.equal((await fetch(base + '/ar/projects/fixture-garden')).status, 404);
    assert.equal((await fetch(base + '/media/project-images/' + images[0].id)).status, 404);
    await page.getByText('Delete draft', { exact: true }).click();
    await page.getByRole('checkbox', { name: /Delete this draft/ }).check();
    await page.getByRole('button', { name: 'Delete permanently' }).click();
    await page.waitForURL('**/admin/projects?notice=deleted');
    assert.equal(projects.length, 0);
    await page.getByRole('button', { name: 'Sign out' }).click();
    await page.waitForURL('**/admin/login');
    assert.deepEqual(pageErrors, []);
    console.log('Local browser fixture passed auth, admin CRUD, retry UX, reorder, bilingual preview, publish, invalidation, service edits and logout. No live provider calls.');
  } finally {
    await browser?.close();
    server.kill();
    backend.closeAllConnections();
    await new Promise(resolve => backend.close(resolve));
  }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
