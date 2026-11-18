import Link from 'next/link';
import { AdminDataError } from '@/components/admin/fields';
import { requireAdmin } from '@/lib/cms/auth';

export default async function Dashboard() {
  const { client } = await requireAdmin();
  const [total, published, drafts, media, recent] = await Promise.all([
    client.from('projects').select('id', { head: true, count: 'exact' }),
    client.from('projects').select('id', { head: true, count: 'exact' }).eq('status', 'published'),
    client.from('projects').select('id', { head: true, count: 'exact' }).eq('status', 'draft'),
    client.from('project_images').select('id', { head: true, count: 'exact' }),
    client.from('projects').select('id,title,slug,status,updated_at').order('updated_at', { ascending: false }).limit(6),
  ]);
  return (
    <div className="admin-stack">
      <header className="admin-page-header">
        <div><p className="eyebrow">Content workspace</p><h1>Overview</h1><p className="admin-help">Manage projects, photographs and bilingual services.</p></div>
        <Link className="button primary" href="/admin/projects/new">Create a project</Link>
      </header>
      {[total, published, drafts, media, recent].some(result => result.error) ? <AdminDataError /> : (
        <>
          <dl className="admin-stats">
            {([['Total projects', total.count], ['Published projects', published.count], ['Draft projects', drafts.count], ['Managed images', media.count]] as const).map(([label, count]) => (
              <div key={label} className="admin-panel"><dt>{label}</dt><dd>{count ?? 0}</dd></div>
            ))}
          </dl>
          <section className="admin-panel admin-stack">
            <h2>Recently edited</h2>
            {!recent.data?.length ? <p className="admin-help">No managed projects yet. The public site can still show its illustrative examples.</p> : (
              <ul className="admin-list">
                {recent.data.map(project => (
                  <li className="admin-row" key={project.id}>
                    <Link className="text-link" href={'/admin/projects/' + project.id + '/edit'}>{project.title.en || project.slug}</Link>
                    <span className="admin-badge">{project.status}</span>
                    <time dateTime={project.updated_at}>{new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeZone: 'Asia/Qatar' }).format(new Date(project.updated_at))}</time>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
