import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProjectDetail } from '@/components/site';
import { AdminDataError } from '@/components/admin/fields';
import { requireAdmin } from '@/lib/cms/auth';
import { cloudinaryConfig } from '@/lib/cms/env';
import { getPublishedServices, projectFromRecord } from '@/lib/cms/public';
import { uuidPattern, type ProjectRecord } from '@/lib/cms/records';

export default async function PreviewProject({ params, searchParams }: {
  params: Promise<{ id: string }>; searchParams: Promise<{ lang?: string }>;
}) {
  const { client } = await requireAdmin();
  const [{ id }, { lang }] = await Promise.all([params, searchParams]);
  if (!uuidPattern.test(id)) notFound();
  const { data, error } = await client.from('projects').select('*,project_images(*)').eq('id', id).maybeSingle();
  if (error) return <AdminDataError />;
  if (!data) notFound();
  const record = data as ProjectRecord;
  const locale = lang === 'ar' ? 'ar' : 'en';
  const project = projectFromRecord(record, true);
  return (
    <div className="admin-stack">
      <header className="admin-page-header">
        <div><p className="eyebrow">Private preview</p><h1>Preview project</h1><p className="admin-help">Only authorized administrators can open this preview.</p></div>
        <div className="admin-row admin-actions">
          <Link className="button ghost" href={'/admin/projects/' + id + '/edit'}>Back to edit</Link>
          <Link className="button ghost" href={'?lang=' + (locale === 'en' ? 'ar' : 'en')}>{locale === 'en' ? 'Preview Arabic' : 'Preview English'}</Link>
        </div>
      </header>
      {project && cloudinaryConfig() ? (
        <div className="admin-preview" lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
          <ProjectDetail locale={locale} item={project} serviceItems={await getPublishedServices()} />
        </div>
      ) : <section className="admin-panel admin-stack" lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        <h2>{record.title[locale] || record.slug}</h2>
        {record.description[locale] && <p>{record.description[locale]}</p>}
        <p className="admin-help">{locale === 'ar' ? 'تتطلب المعاينة الكاملة صورتين متطابقتين قبل وبعد وإعداد Cloudinary.' : 'Upload a matching Before and After pair and configure Cloudinary to preview the complete page.'}</p>
      </section>}
    </div>
  );
}
