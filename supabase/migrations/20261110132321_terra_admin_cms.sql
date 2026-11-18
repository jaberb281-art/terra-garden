create schema terra_private;
revoke all on schema terra_private from public;
grant usage on schema terra_private to authenticated;

create table public.admin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'editor')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index terra_one_active_owner on public.admin_profiles (role)
  where role = 'owner' and active;

create function terra_private.is_admin() returns boolean
language sql stable security invoker set search_path = ''
as $$
  select exists (select 1 from public.admin_profiles
    where user_id = (select auth.uid()) and active and role in ('owner', 'editor'));
$$;
revoke all on function terra_private.is_admin() from public;
grant execute on function terra_private.is_admin() to authenticated;

create function terra_private.localized(value jsonb, max_length integer, complete boolean default false)
returns boolean language sql immutable security invoker set search_path = ''
as $$
  select coalesce(jsonb_typeof(value) = 'object'
    and jsonb_typeof(value->'en') = 'string' and jsonb_typeof(value->'ar') = 'string'
    and length(value->>'en') <= max_length and length(value->>'ar') <= max_length
    and (not complete or (length(btrim(value->>'en')) > 0 and length(btrim(value->>'ar')) > 0)), false);
$$;

create function terra_private.scope_valid(value jsonb)
returns boolean language sql immutable security invoker set search_path = ''
as $$
  select case when jsonb_typeof(value) = 'array' then
    jsonb_array_length(value) between 1 and 12 and not exists (
      select 1 from jsonb_array_elements(value) entry where not terra_private.localized(entry, 300, true)
    ) else false end;
$$;

create table public.services (
  slug text primary key check (slug in ('grass-cutting','garden-maintenance','landscaping','plant-and-irrigation')),
  title jsonb not null check (terra_private.localized(title, 100, true)),
  summary jsonb not null check (terra_private.localized(summary, 350, true)),
  detail jsonb not null check (terra_private.localized(detail, 3500, true)),
  scope jsonb not null check (terra_private.scope_valid(scope)),
  image text not null check (image in ('villa-after','patio-after','hero','nursery','farm-after')),
  image_alt jsonb not null check (terra_private.localized(image_alt, 240, true)),
  seo_title jsonb not null default '{"en":"","ar":""}' check (terra_private.localized(seo_title, 90)),
  seo_description jsonb not null default '{"en":"","ar":""}' check (terra_private.localized(seo_description, 220)),
  status text not null default 'published' check (status in ('draft','published')),
  sort_order integer not null default 0 check (sort_order between 0 and 10000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.service_faqs (
  id uuid primary key default gen_random_uuid(),
  service_slug text not null references public.services(slug) on delete cascade,
  question jsonb not null check (terra_private.localized(question, 200, true)),
  answer jsonb not null check (terra_private.localized(answer, 1200, true)),
  sort_order integer not null default 0 check (sort_order between 0 and 10000),
  created_at timestamptz not null default now()
);
create index terra_faqs_service_order on public.service_faqs (service_slug, sort_order);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (length(slug) between 1 and 80 and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
    and slug not in ('villa-garden-makeover','outdoor-living-renewal','farm-landscape-care')),
  category text not null check (category in ('villas','commercial','farms')),
  title jsonb not null check (terra_private.localized(title, 120)),
  search_text text generated always as (slug || ' ' || coalesce(title->>'en','') || ' ' || coalesce(title->>'ar','')) stored,
  description jsonb not null check (terra_private.localized(description, 600)),
  story jsonb not null check (terra_private.localized(story->'challenge', 2500)
    and terra_private.localized(story->'approach', 2500) and terra_private.localized(story->'outcome', 2500)),
  location jsonb not null default '{"en":"","ar":""}' check (terra_private.localized(location, 120)),
  related_services text[] not null default '{}' check (cardinality(related_services) <= 4
    and related_services <@ array['grass-cutting','garden-maintenance','landscaping','plant-and-irrigation']::text[]),
  status text not null default 'draft' check (status in ('draft','published')),
  provenance text not null default 'illustrative' check (provenance in ('illustrative','authentic')),
  seo_title jsonb not null default '{"en":"","ar":""}' check (terra_private.localized(seo_title, 90)),
  seo_description jsonb not null default '{"en":"","ar":""}' check (terra_private.localized(seo_description, 220)),
  sort_order integer not null default 0 check (sort_order between 0 and 10000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);
create index terra_projects_public_order on public.projects (sort_order, published_at desc, id)
  where status = 'published';
create index terra_projects_edited on public.projects (updated_at desc);

create table public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  asset_id text not null unique check (asset_id ~ '^[a-f0-9]{32}$'),
  public_id text not null unique,
  role text not null check (role in ('before','after','gallery')),
  width integer not null check (width between 320 and 6000),
  height integer not null check (height between 240 and 6000),
  bytes integer not null check (bytes between 1 and 4194304),
  format text not null check (format in ('jpg','png','webp')),
  version integer not null check (version > 0),
  alt jsonb not null check (terra_private.localized(alt, 240, true)),
  caption jsonb not null default '{"en":"","ar":""}' check (terra_private.localized(caption, 300)),
  sort_order integer not null default 0 check (sort_order between 0 and 10000),
  created_at timestamptz not null default now(),
  check (width::bigint * height <= 24000000),
  check (public_id ~ ('^terra/projects/' || project_id || '/' || role || '/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'))
);
create unique index terra_one_primary_per_role on public.project_images (project_id, role) where role in ('before','after');
create index terra_project_media_order on public.project_images (project_id, sort_order, id);

create function terra_private.touch_updated() returns trigger
language plpgsql security invoker set search_path = ''
as $$ begin new.updated_at := clock_timestamp(); return new; end; $$;
create trigger terra_profile_touch before update on public.admin_profiles
for each row execute function terra_private.touch_updated();
create trigger terra_service_touch before update on public.services
for each row execute function terra_private.touch_updated();

create function terra_private.guard_project() returns trigger
language plpgsql security invoker set search_path = ''
as $$
begin
  if tg_op = 'DELETE' then
    if old.status = 'published' then raise exception 'Unpublish the project before deleting it'; end if;
    return old;
  end if;
  if tg_op = 'UPDATE' then
    if old.id <> new.id or (old.published_at is not null and old.slug <> new.slug) then
      raise exception 'The project ID and previously published slug cannot change';
    end if;
    if old.status = 'published' and new.provenance <> old.provenance then
      raise exception 'Unpublish the project before changing provenance';
    end if;
    new.created_at := old.created_at;
    new.published_at := old.published_at;
  else
    new.created_at := now();
    new.published_at := null;
  end if;
  new.updated_at := clock_timestamp();
  if new.status = 'published' then
    if not (
      terra_private.localized(new.title, 120, true) and terra_private.localized(new.description, 600, true)
      and terra_private.localized(new.story->'challenge', 2500, true)
      and terra_private.localized(new.story->'approach', 2500, true)
      and terra_private.localized(new.story->'outcome', 2500, true)
    ) then raise exception 'Complete both languages before publishing'; end if;
    if not exists (
      select 1 from public.project_images b join public.project_images a
      on a.project_id = b.project_id and a.role = 'after'
      where b.project_id = new.id and b.role = 'before' and a.width = b.width and a.height = b.height
    ) then raise exception 'A Before and After pair with matching dimensions is required'; end if;
    new.published_at := coalesce(new.published_at, now());
  end if;
  return new;
end;
$$;
create trigger terra_project_guard before insert or update or delete on public.projects
for each row execute function terra_private.guard_project();

create function terra_private.guard_media() returns trigger
language plpgsql security invoker set search_path = ''
as $$
declare parent_status text;
begin
  if tg_op = 'UPDATE' and (
    old.id <> new.id or old.project_id <> new.project_id or old.role <> new.role
    or old.asset_id <> new.asset_id or old.public_id <> new.public_id
    or old.width <> new.width or old.height <> new.height or old.bytes <> new.bytes
    or old.format <> new.format or old.version <> new.version
  ) then raise exception 'Image identity is immutable'; end if;
  select status into parent_status from public.projects
    where id = case when tg_op = 'DELETE' then old.project_id else new.project_id end
    for update;
  if parent_status = 'published' then raise exception 'Unpublish the project before editing media'; end if;
  if tg_op = 'DELETE' then return old; end if;
  if tg_op = 'INSERT' and new.role = 'gallery' and (
    select count(*) from public.project_images where project_id = new.project_id and role = 'gallery'
  ) >= 24 then raise exception 'A project can contain at most 24 gallery images'; end if;
  return new;
end;
$$;
create trigger terra_media_guard before insert or update or delete on public.project_images
for each row execute function terra_private.guard_media();

alter table public.admin_profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_images enable row level security;
alter table public.services enable row level security;
alter table public.service_faqs enable row level security;

revoke all on public.admin_profiles, public.projects, public.project_images, public.services, public.service_faqs from public, anon, authenticated;
grant select on public.admin_profiles to authenticated;
grant select on public.projects, public.project_images, public.services, public.service_faqs to anon, authenticated;
grant insert, update, delete on public.projects, public.project_images, public.service_faqs to authenticated;
grant update (title, summary, detail, scope, image, image_alt, seo_title, seo_description, status, sort_order) on public.services to authenticated;
revoke all on all functions in schema terra_private from public, anon, authenticated;
grant execute on function terra_private.is_admin() to authenticated;
grant execute on function terra_private.localized(jsonb,integer,boolean), terra_private.scope_valid(jsonb) to authenticated;

create policy admin_self_read on public.admin_profiles for select to authenticated using (user_id = (select auth.uid()) and active);
create policy project_public_read on public.projects for select to anon, authenticated using (status = 'published');
create policy project_admin on public.projects for all to authenticated
  using ((select terra_private.is_admin())) with check ((select terra_private.is_admin()));
create policy image_public_read on public.project_images for select to anon, authenticated using (
  exists (select 1 from public.projects p where p.id = project_id and p.status = 'published')
);
create policy image_admin on public.project_images for all to authenticated
  using ((select terra_private.is_admin())) with check ((select terra_private.is_admin()));
create policy service_public_read on public.services for select to anon, authenticated using (status = 'published');
create policy service_admin_read on public.services for select to authenticated using ((select terra_private.is_admin()));
create policy service_admin_update on public.services for update to authenticated
  using ((select terra_private.is_admin())) with check ((select terra_private.is_admin()));
create policy faq_public_read on public.service_faqs for select to anon, authenticated using (
  exists (select 1 from public.services s where s.slug = service_slug and s.status = 'published')
);
create policy faq_admin on public.service_faqs for all to authenticated
  using ((select terra_private.is_admin())) with check ((select terra_private.is_admin()));

-- Both RPCs run as the caller and retain table-level RLS.
create function public.terra_replace_image(p_project uuid, p_image jsonb) returns jsonb
language plpgsql security invoker set search_path = ''
as $$
declare
  prior public.project_images;
  candidate public.project_images;
  parent_status text;
begin
  if not terra_private.is_admin() then raise insufficient_privilege; end if;
  select status into parent_status from public.projects where id = p_project for update;
  if parent_status is distinct from 'draft' then raise exception 'A draft project is required'; end if;
  candidate := jsonb_populate_record(null::public.project_images, p_image);
  if candidate.role in ('before','after') then
    delete from public.project_images where project_id = p_project and role = candidate.role returning * into prior;
  end if;
  insert into public.project_images(project_id,asset_id,public_id,role,width,height,bytes,format,version,alt,caption,sort_order)
  values(p_project,candidate.asset_id,candidate.public_id,candidate.role,candidate.width,candidate.height,
    candidate.bytes,candidate.format,candidate.version,candidate.alt,candidate.caption,candidate.sort_order)
  returning * into candidate;
  update public.projects set sort_order = sort_order where id = p_project;
  return jsonb_build_object('image', to_jsonb(candidate), 'replaced', case when prior.id is null then null else to_jsonb(prior) end);
end;
$$;

create function public.terra_save_service(p_slug text, p_version timestamptz, p_service jsonb, p_faqs jsonb) returns void
language plpgsql security invoker set search_path = ''
as $$
declare
  candidate public.services;
  entry jsonb;
  position integer := 0;
begin
  if not terra_private.is_admin() then raise insufficient_privilege; end if;
  if jsonb_typeof(p_faqs) is distinct from 'array' or jsonb_array_length(p_faqs) > 12 then
    raise exception 'At most 12 FAQs are allowed';
  end if;
  candidate := jsonb_populate_record(null::public.services, p_service);
  update public.services set title=candidate.title, summary=candidate.summary, detail=candidate.detail,
    scope=candidate.scope, image=candidate.image, image_alt=candidate.image_alt, seo_title=candidate.seo_title,
    seo_description=candidate.seo_description, status=candidate.status, sort_order=candidate.sort_order
    where slug=p_slug and updated_at=p_version;
  if not found then raise exception 'This service changed. Reload before saving'; end if;
  delete from public.service_faqs where service_slug = p_slug;
  for entry in select value from jsonb_array_elements(p_faqs) loop
    insert into public.service_faqs(service_slug, question, answer, sort_order)
      values (p_slug, entry->'question', entry->'answer', position);
    position := position + 1;
  end loop;
end;
$$;
revoke all on function public.terra_replace_image(uuid,jsonb), public.terra_save_service(text,timestamptz,jsonb,jsonb)
  from public, anon, authenticated;
grant execute on function public.terra_replace_image(uuid,jsonb), public.terra_save_service(text,timestamptz,jsonb,jsonb)
  to authenticated;
