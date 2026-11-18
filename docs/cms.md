# TERRA CMS

The admin workspace is at `/admin/login`. It manages bilingual projects, project photographs, and the four existing service records and their FAQs. Public project templates, service URLs, and contact behavior are shared with the existing site.

## Dedicated provider setup

1. Use Node.js 22 or newer and run `npm ci`.
2. Identify a Supabase project reserved for TERRA. Confirm the project reference with the owner before linking or applying the versioned migrations in `supabase/migrations/`. No hosted migration is part of the local implementation.
3. For an isolated local stack, run `npx supabase start` with the Docker engine running. Use the local project URL and the publishable key reported by the CLI. The repository includes a local configuration with public and anonymous sign-up disabled. Disable public sign-up in the hosted Auth dashboard as well and enable secure password changes. Keep the Data API enabled for the five tables in the public schema. The migration applies explicit table grants.
4. Copy `.env.example` to `.env.local`. Fill in `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET`. Keep the Cloudinary key and secret server-side. No Supabase secret or service-role key is needed. Use a Cloudinary environment reserved for TERRA and avoid unsigned upload presets.
5. Leave `SITE_ALLOW_INDEXING=false` and the WhatsApp number blank. Restart the local server or rebuild after changing environment values.

Use Supabase Auth's administrative UI to create or invite the initial owner. Verify the account before assigning access. As the database owner, insert the user's exact Auth UUID. The owner UUID below is a placeholder.

```sql
insert into public.admin_profiles (user_id, role, active)
values ('REPLACE_WITH_AUTH_USER_UUID'::uuid, 'owner', true);
```

The active owner is unique. The schema can support explicitly provisioned editors later. Grant or revoke access only through an approved database-owner operation. The site does not let an administrator grant roles, and a revoked profile immediately loses application and database access even if its Auth session is still valid.

## Editing and publishing

Save a draft to obtain a stable ID. Fill in the English and Arabic text, choose the related services, and attach the Before and After images. Their pixel dimensions must match. Use the private English and Arabic previews to verify that the photos depict the same view and that captions, alt text and copy make sense. For authentic projects, confirm that the work, any location shown, and photographs are approved for publication. Publish when the draft is complete.

Media edits require a draft. Unpublish before replacing or removing an image, and publish again after checking the preview. Gallery ordering is numeric, with lower values displayed first. A slug becomes immutable after the first publication. The three existing sample slugs are reserved so their public links keep working. Projects marked illustrative remain labeled wherever they appear.

The Services editor uses the approved local image library. It saves localized text, image selection and alt text, status, order, SEO fields and FAQs in one database transaction. Changing a service record to draft hides the CMS version and restores the original public service copy at the same URL.

## Authorization, media and caching

- Supabase SSR refreshes admin sessions through the Next.js proxy. Each sensitive action and protected page verifies the user and active admin profile server-side. Admin pages and image responses use private cache headers. Server actions use Next.js origin checks and a 256 KB body limit. The upload route additionally checks the request origin and enforces a byte cap even when the client omits Content-Length.
- Row-level security applies to all five tables. Anonymous queries can read published projects, their image records, and published services and FAQs. Admin profiles are private to the authorized account, with writes reserved for the database owner. The two atomic RPCs run as the caller under RLS. Database triggers enforce publication requirements, lock media edits to drafts, and prevent moving an image to a different project.
- The browser sends a bounded upload to TERRA, which verifies type and uses the Cloudinary SDK to sign the request on the server. The original is stored as an authenticated asset under a generated project and role prefix. The app verifies the returned identity, dimensions and size before storing metadata. The Before/After replacement is atomic in PostgreSQL. Cleanup verifies the Cloudinary asset ID before deleting a removed original. A failed or ambiguous cross-provider write can leave an authenticated orphan. Review the server logs and compare the project prefix against live database references before removing any orphan.
- Deleting an unpublished project removes its CMS records and retains authenticated originals for recovery. Before permanently deleting the detached originals, review the exact prefix and confirm no active record references them. A browser retry after an ambiguous response should start by reloading the gallery and checking whether the original upload already attached.
- Public image delivery checks current published visibility through the anonymous database role. Private preview delivery requires an admin. Uploads synchronously generate and validate four responsive WebP renditions because Cloudinary authenticated assets require pre-generated transformations. The app requests those signed renditions server-side and streams the image without revealing its signed URL. The no-store policy prevents stale application or browser cache entries from serving an unpublished asset. Previously downloaded copies cannot be recalled.
- Published content uses tagged Next.js fetches. CMS actions expire the tag and revalidate the relevant localized home, services, projects and sitemap routes. Managed projects are ordered before static samples, and authentic work is shown first. Draft records stay private. When configuration is missing, the original public site remains available.
- Before a production launch, test HTTPS and any reverse-proxy origin headers, enforce Supabase rate limits for the chosen Auth setup, and monitor authorized upload volume and orphaned assets. Keep the public inquiry form and WhatsApp out of this setup.

## Test coverage

```sh
npm install --prefix .qa --no-save playwright-core axe-core @electric-sql/pglite
npm run lint
npm run build
npx tsc --noEmit
node tests/seo.cjs
node tests/cms-db.cjs
node tests/cms-browser-fixture.cjs
```

The database test executes the migrations in PGlite with real PostgreSQL roles and policies and a minimal local Auth identity stub. The browser fixture runs a local substitute for Supabase and intercepts Cloudinary-dependent rendering and retry paths. It cannot prove provider compatibility. It starts an isolated Next.js process on port 3101 and a loopback fixture on port 54419. Build without external CMS credentials for this test. Rebuild after fixture testing before using the same build output for an unconfigured preview.

The existing bilingual browser checks run against the unconfigured production build on port 3100. A real hosted smoke test still requires an approved dedicated Supabase project, a configured Cloudinary environment and authorized test credentials. Confirm the provider-side folder and authenticated delivery behavior with a disposable draft before publishing real work.
