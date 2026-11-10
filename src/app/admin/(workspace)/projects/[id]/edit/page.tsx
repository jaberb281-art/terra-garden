import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AdminDataError, AdminNotice } from '@/components/admin/fields';
import { ProjectFields, ProjectMedia, PublicationControls } from '@/components/admin/project';
import { requireAdmin } from '@/lib/cms/auth';
import { cloudinaryConfig } from '@/lib/cms/env';
import { uuidPattern, type ProjectRecord } from '@/lib/cms/records';
import { publishingProblem } from '@/lib/cms/validation';

const messages: Record<string, string> = {
  created: 'Draft saved. You can now add photographs.',
  saved: 'Project details saved.',
  published: 'Project published in both languages.',
  unpublished: 'Project returned to draft.',
  media: 'Image records updated.',
  'media-cleanup': 'Image detached. Cloudinary cleanup needs owner review.',
};

export default async function EditProject({ params, searchParams }: {
  params: Promise<{ id: string }>; searchParams: Promise<{ notice?: string }>;
}) {
  const { client } = await requireAdmin();
  const [{ id }, { notice }] = await Promise.all([params, searchParams]);
  if (!uuidPattern.test(id)) notFound();
  const { data, error } = await client.from('projects').select('*,project_images(*)').eq('id', id).maybeSingle();
  if (error) return <AdminDataError />;
  if (!data) notFound();
  const project = data as ProjectRecord;
  const issue = project.status === 'draft' ? publishingProblem(project) : null;
  return (
    <div className="admin-stack">
      <header className="admin-page-header">
        <div><p className="eyebrow">Edit project</p><h1>{project.title.en || project.slug}</h1><span className="admin-badge" data-status={project.status}>{project.status}</span></div>
        <Link className="button ghost" href="/admin/projects">All projects</Link>
      </header>
      <AdminNotice message={notice && Object.hasOwn(messages, notice) ? messages[notice] : undefined} />
      <section className="admin-panel admin-stack">
        <h2>Project details</h2>
        <ProjectFields key={project.updated_at} project={project} />
      </section>
      <ProjectMedia project={project} cloudReady={Boolean(cloudinaryConfig())} />
      <section className="admin-panel admin-stack">
        <h2>Publishing</h2>
        {issue && <p className="admin-help">{issue}</p>}
        <PublicationControls project={project} />
      </section>
    </div>
  );
}
