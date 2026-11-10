const assert = require('node:assert/strict');
const { readFile, readdir } = require('node:fs/promises');
const { PGlite } = require('../.qa/node_modules/@electric-sql/pglite');

const owner = '20000000-0000-4000-8000-000000000001';
const guest = '20000000-0000-4000-8000-000000000002';
const first = '20000000-0000-4000-8000-000000000003';
const second = '20000000-0000-4000-8000-000000000004';
const title = { en: 'Test project', ar: 'مشروع اختباري' };
const story = { challenge: title, approach: title, outcome: title };
const migrationDir = 'supabase/migrations';

async function run() {
  const db = new PGlite();
  try {
    // Use real PostgreSQL roles and policies with the minimal Supabase auth contract.
    await db.exec(`
      create role anon; create role authenticated;
      create schema auth;
      create table auth.users(id uuid primary key);
      create function auth.uid() returns uuid language sql stable
      as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
      grant usage on schema auth to anon, authenticated;
      grant execute on function auth.uid() to anon, authenticated;
    `);
    for (const file of (await readdir(migrationDir)).filter(file => file.endsWith('.sql')).sort()) {
      await db.exec(await readFile(migrationDir + '/' + file, 'utf8'));
    }

    await db.query('insert into auth.users values ($1), ($2)', [owner, guest]);
    await db.query("insert into public.admin_profiles(user_id,role) values ($1,'owner')", [owner]);
    const actAs = async (role, user = '') => {
      await db.exec('reset role');
      await db.query("select set_config('request.jwt.claim.sub',$1,false)", [user]);
      await db.exec('set role ' + role);
    };
    const count = async table => Number((await db.query('select count(*) from public.' + table)).rows[0].count);
    const create = (id, slug) => db.query(
      "insert into public.projects(id,slug,category,title,description,story) values($1,$2,'villas',$3,$3,$4)",
      [id, slug, title, story],
    );
    const publish = id => db.query("update public.projects set status='published' where id=$1 returning id", [id]);
    const attach = (id, role, i, width = 1000, sortOrder = 0) => db.query('select public.terra_replace_image($1,$2) as result', [id, {
      role, width, height: 800, bytes: 2000, version: 123, format: 'jpg', alt: title, caption: { en: '', ar: '' },
      sort_order: sortOrder, asset_id: i.toString(16).padStart(32, '0'),
      public_id: 'terra/projects/' + id + '/' + role + '/20000000-0000-4000-8000-' + String(i).padStart(12, '0'),
    }]);

    await actAs('anon');
    assert.equal(await count('services'), 4);
    assert.equal(await count('service_faqs'), 8);
    assert.equal(await count('projects'), 0);
    await assert.rejects(count('admin_profiles'), /permission denied/);
    await assert.rejects(create(first, 'garden-fixture'), /permission denied/);

    await actAs('authenticated', guest);
    assert.equal(await count('admin_profiles'), 0);
    await assert.rejects(db.query("insert into public.admin_profiles values ($1,'editor',true,now(),now())", [guest]), /permission denied/);
    await assert.rejects(create(first, 'garden-fixture'), /row-level security/);
    await assert.rejects(attach(first, 'before', 7), { code: '42501' });

    await actAs('authenticated', owner);
    assert.equal(await count('admin_profiles'), 1);
    await create(first, 'garden-fixture');
    await assert.rejects(create(second, 'garden-fixture'), /duplicate key/);
    await assert.rejects(create(second, 'villa-garden-makeover'), /check constraint/);
    await create(second, 'second-fixture');
    await assert.rejects(publish(first), /matching dimensions/);
    await attach(first, 'before', 11);
    await attach(first, 'after', 12, 980);
    await assert.rejects(publish(first), /matching dimensions/);
    await assert.rejects(attach(first, 'after', 13, 12), /check constraint/);
    assert.equal((await db.query("select width from public.project_images where role='after'")).rows[0].width, 980, 'failed replacement preserves old image');
    const replacement = (await attach(first, 'after', 14)).rows[0].result;
    assert.equal(replacement.replaced.width, 980);
    await attach(first, 'gallery', 15, 1000, 10);
    await attach(first, 'gallery', 16, 1000, 20);
    await db.query("update public.project_images set sort_order=0 where asset_id=$1", [(16).toString(16).padStart(32, '0')]);
    assert.equal((await db.query("select sort_order from public.project_images where role='gallery' order by sort_order")).rows[0].sort_order, 0);
    await assert.rejects(db.query("update public.project_images set project_id=$1 where project_id=$2", [second, first]), /identity is immutable/);
    await assert.rejects(db.query("select public.terra_replace_image($1,$2)", [second, replacement.image]), /check constraint/);
    assert.equal((await publish(first)).rows.length, 1);
    await assert.rejects(db.query("update public.projects set slug='different' where id=$1", [first]), /published slug/);
    await assert.rejects(db.query("delete from public.project_images where project_id=$1", [first]), /Unpublish/);
    await assert.rejects(db.query("delete from public.projects where id=$1", [first]), /Unpublish/);

    await actAs('anon');
    assert.equal(await count('projects'), 1);
    assert.equal(await count('project_images'), 4);
    assert.equal((await db.query('select id from public.projects')).rows[0].id, first);
    await actAs('authenticated', guest);
    assert.equal(await count('projects'), 1);
    assert.equal((await db.query("update public.projects set status='draft' where id=$1 returning id", [first])).rows.length, 0);
    assert.equal((await db.query('delete from public.projects where id=$1 returning id', [first])).rows.length, 0);
    assert.equal((await db.query('update public.project_images set sort_order=4 returning id')).rows.length, 0);
    await assert.rejects(db.query("select public.terra_save_service('grass-cutting',now(),'{}','[]')"), { code: '42501' });

    await actAs('authenticated', owner);
    const service = (await db.query("select * from public.services where slug='grass-cutting'")).rows[0];
    const faq = [{ question: title, answer: title }];
    await db.query('select public.terra_save_service($1,$2,$3,$4)', [service.slug, service.updated_at, { ...service, status: 'draft' }, JSON.stringify(faq)]);
    await assert.rejects(db.query('select public.terra_save_service($1,$2,$3,$4)', [service.slug, service.updated_at, service, '[]']), /changed/);
    await db.query("update public.projects set status='draft' where id=$1", [first]);

    await actAs('anon');
    assert.equal(await count('projects'), 0);
    assert.equal(await count('project_images'), 0);
    assert.equal(await count('services'), 3);
    assert.equal(await count('service_faqs'), 6);

    await actAs('authenticated', owner);
    await db.query('delete from public.projects where id=$1', [first]);
    assert.equal(await count('project_images'), 0);
    await db.exec('reset role');
    await db.query('update public.admin_profiles set active=false where user_id=$1', [owner]);
    await actAs('authenticated', owner);
    assert.equal(await count('projects'), 0);
    await assert.rejects(create(first, 'garden-fixture'), /row-level security/);

    console.log('CMS migrations, role policies, publication, media replacement, ordering and service updates passed in local PostgreSQL (PGlite).');
  } finally { await db.close(); }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
