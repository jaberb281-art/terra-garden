import Link from 'next/link';
import { AdminDataError, AdminNotice } from '@/components/admin/fields';
import { categoryNames, PublicationControls } from '@/components/admin/project';
import { MediaImage } from '@/components/media-image';
import { requireAdmin } from '@/lib/cms/auth';
import { categories, type ProjectRecord } from '@/lib/cms/records';

const pageSize = 20;

export default async function ProjectList({ searchParams }: {
  searchParams: Promise<{ q?: string; status?: string; category?: string; page?: string; notice?: string }>;
}) {
  const { client } = await requireAdmin();
  const filters = await searchParams;
  const query = typeof filters.q === 'string' ? filters.q.trim().slice(0, 80) : '';
  const status = filters.status === 'draft' || filters.status === 'published' ? filters.status : '';
  const category = categories.find(entry => entry === filters.category) ?? '';
  const page = Math.max(1, Math.min(5000, Number.parseInt(filters.page ?? '1', 10) || 1));
  let request = client.from('projects').select('*,project_images(*)', { count: 'exact' })
    .order('updated_at', { ascending: false }).order('id').range((page - 1) * pageSize, page * pageSize - 1);
  if (query) request = request.ilike('search_text', '%' + query.replace(/[\\%_]/g, '\\$&') + '%');
  if (status) request = request.eq('status', status);
  if (category) request = request.eq('category', category);
  const { data, error, count } = await request;
  const projects = (data ?? []) as ProjectRecord[];

  function pageUrl(next: number) {
    return '/admin/projects?' + new URLSearchParams({ q: query, status, category, page: String(next) });
  }

  return (
    <div className="admin-stack">
      <header className="admin-page-header">
        <div><p className="eyebrow">Content workspace</p><h1>Projects</h1><p className="admin-help">Find, review and publish bilingual projects.</p></div>
        <Link href="/admin/projects/new" className="button primary">New project</Link>
      </header>
      <AdminNotice message={filters.notice === 'deleted' ? 'Draft deleted.' : undefined} />
      <form className="admin-panel admin-filter" method="get" action="/admin/projects">
        <label>Search <input type="search" name="q" defaultValue={query} maxLength={80} placeholder="Title or slug" /></label>
        <label>Status <select name="status" defaultValue={status}><option value="">All statuses</option><option value="draft">Draft</option><option value="published">Published</option></select></label>
        <label>Category <select name="category" defaultValue={category}><option value="">All categories</option>{categories.map(entry => <option key={entry} value={entry}>{categoryNames[entry]}</option>)}</select></label>
        <button className="button primary" type="submit">Apply filters</button>
      </form>
      {error ? <AdminDataError /> : !projects.length ? <p className="admin-panel">No projects match these filters.</p> : (
        <ul className="admin-list admin-stack">
          {projects.map(project => {
            const photo = project.project_images.find(image => image.role === 'after');
            return (
              <li key={project.id} className="admin-panel admin-project-row">
                <div className="admin-thumbnail">
                  {photo ? <MediaImage src={'/admin/media/' + photo.id} alt={photo.alt.en} fill sizes="104px" /> : <span>No photo</span>}
                </div>
                <div>
                  <h2>{project.title.en || project.title.ar || project.slug}</h2>
                  <p className="admin-help">{categoryNames[project.category]} · {project.provenance}</p>
                  <p className="admin-help">Updated <time dateTime={project.updated_at}>{new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeZone: 'Asia/Qatar' }).format(new Date(project.updated_at))}</time></p>
                  <span className="admin-badge" data-status={project.status}>{project.status}</span>
                </div>
                <div className="admin-stack admin-project-actions">
                  <Link className="button ghost" href={'/admin/projects/' + project.id + '/edit'}>Edit project</Link>
                  <details className="admin-inset">
                    <summary>Publishing options</summary>
                    <PublicationControls project={project} compact />
                  </details>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {!error && (page > 1 || (count ?? 0) > page * pageSize) && <nav className="admin-row" aria-label="Project list pages">
        {page > 1 && <Link className="button ghost" href={pageUrl(page - 1)}>Previous page</Link>}
        {(count ?? 0) > page * pageSize && <Link className="button ghost" href={pageUrl(page + 1)}>Next page</Link>}
      </nav>}
    </div>
  );
}
