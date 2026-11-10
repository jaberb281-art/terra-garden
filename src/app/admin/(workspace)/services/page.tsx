import Link from 'next/link';
import { services } from '@/content/catalog';
import { pair, photo } from '@/content/site';
import { AdminForm, FaqEditor } from '@/components/admin/forms';
import { AdminDataError, AdminNotice, BilingualField } from '@/components/admin/fields';
import { requireAdmin } from '@/lib/cms/auth';
import { serviceImages, type ServiceRecord } from '@/lib/cms/records';
import { saveService } from '../../actions';
import Image from 'next/image';

export default async function AdminServices({ searchParams }: { searchParams: Promise<{ service?: string; notice?: string }> }) {
  const { client } = await requireAdmin();
  const { service: selected, notice } = await searchParams;
  const slug = services.find(service => service.slug === selected)?.slug ?? services[0].slug;
  const { data, error } = await client.from('services').select('*,service_faqs(*)').eq('slug', slug).maybeSingle();
  const record = data as ServiceRecord | null;

  return (
    <div className="admin-stack">
      <header className="admin-page-header">
        <div><p className="eyebrow">Content workspace</p><h1>Services</h1><p className="admin-help">Edit bilingual content, imagery, search metadata and FAQs. Public service URLs stay the same.</p></div>
      </header>
      <nav className="admin-row admin-actions" aria-label="Choose a service">
        {services.map(service => (
          <Link href={'/admin/services?service=' + service.slug} className={'button ' + (slug === service.slug ? 'primary' : 'ghost')} aria-current={slug === service.slug ? 'page' : undefined} key={service.slug}>
            {service.title.en}
          </Link>
        ))}
      </nav>
      <AdminNotice message={notice === 'saved' ? 'Service saved.' : undefined} />
      {error || !record ? <AdminDataError /> : (
        <section className="admin-panel admin-stack">
          <h2>{record.title.en}</h2>
          <AdminForm key={slug + record.updated_at} action={saveService} label="Save service" protect>
            <input type="hidden" name="slug" value={slug} />
            <input type="hidden" name="version" value={record.updated_at} />
            <BilingualField label="Title" name="title" max={100} value={record.title} required />
            <BilingualField label="Summary" name="summary" max={350} value={record.summary} rows={3} required />
            <BilingualField label="Detailed content" name="detail" max={3500} value={record.detail} rows={5} required />
            <BilingualField label="Scope (one item per line)" name="scope" max={3600} value={pair(record.scope.map(value => value.en).join('\n'), record.scope.map(value => value.ar).join('\n'))} rows={5} required />
            <div className="admin-inset admin-stack">
              <h3>Service image</h3>
              <div className="admin-thumbnail"><Image src={photo(record.image)} alt={record.image_alt.en} fill sizes="104px" /></div>
              <label>Choose from the approved image library <select name="image" defaultValue={record.image}>
                {serviceImages.map(image => <option value={image} key={image}>{image.replaceAll('-', ' ')}</option>)}
              </select></label>
              <BilingualField label="Image alt text" name="image_alt" max={240} value={record.image_alt} required />
            </div>
            <div className="admin-fields">
              <label>Status <select name="status" defaultValue={record.status}><option value="published">Published</option><option value="draft">Draft</option></select></label>
              <label>Display order <input type="number" name="sort_order" defaultValue={record.sort_order} min={0} max={10000} /></label>
            </div>
            <p className="admin-help">Draft CMS edits are private. Public visitors see the original service content until the CMS record is published again.</p>
            <details className="admin-inset">
              <summary>Search metadata (optional)</summary>
              <BilingualField label="SEO title" name="seo_title" max={90} value={record.seo_title} />
              <BilingualField label="SEO description" name="seo_description" max={220} value={record.seo_description} rows={2} />
            </details>
            <h3>FAQs</h3>
            <FaqEditor faqs={record.service_faqs} />
          </AdminForm>
        </section>
      )}
    </div>
  );
}
