import Link from 'next/link';
import { ProjectFields } from '@/components/admin/project';
import { requireAdmin } from '@/lib/cms/auth';

export default async function NewProject() {
  await requireAdmin();
  return (
    <div className="admin-stack">
      <header className="admin-page-header">
        <div><p className="eyebrow">Projects</p><h1>New project</h1><p className="admin-help">Save a draft first, then attach and preview photographs.</p></div>
        <Link className="button ghost" href="/admin/projects">All projects</Link>
      </header>
      <div className="admin-panel"><ProjectFields /></div>
    </div>
  );
}
