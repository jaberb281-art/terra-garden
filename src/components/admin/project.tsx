import Link from 'next/link';
import { BilingualField } from './fields';
import { AdminForm, ImageUpload } from './forms';
import { changeMedia, changePublication, createProject, deleteProject, saveProject } from '@/app/admin/actions';
import { services } from '@/content/catalog';
import { categories, imageRoles, type ImageRecord, type ProjectRecord } from '@/lib/cms/records';
import { MediaImage } from '@/components/media-image';

export const categoryNames = { villas: 'Villas', commercial: 'Commercial', farms: 'Farms' };

export function ProjectFields({ project }: { project?: ProjectRecord }) {
  return (
    <AdminForm action={project ? saveProject : createProject} label={project?.status === 'published' ? 'Save published changes' : 'Save draft'} protect>
      {project && <><input type="hidden" name="id" value={project.id} /><input type="hidden" name="version" value={project.updated_at} /></>}
      <div className="admin-fields">
        <label>URL slug
          <input name="slug" defaultValue={project?.slug} required maxLength={80} pattern="[a-z0-9]+(-[a-z0-9]+)*" readOnly={Boolean(project?.published_at)} placeholder="e.g. courtyard-renewal" />
        </label>
        <label>Category
          <select name="category" defaultValue={project?.category ?? 'villas'}>{categories.map(category => <option value={category} key={category}>{categoryNames[category]}</option>)}</select>
        </label>
        <label>Provenance
          <select name="provenance" defaultValue={project?.provenance ?? 'illustrative'} disabled={project?.status === 'published'}>
            <option value="illustrative">Illustrative concept</option><option value="authentic">Authentic completed work</option>
          </select>
        </label>
        {project?.status === 'published' && <input type="hidden" name="provenance" value={project.provenance} />}
        <label>Display order <input name="sort_order" type="number" min={0} max={10000} defaultValue={project?.sort_order ?? 0} /></label>
      </div>
      <p className="admin-help">Lower display orders appear first. Leave location blank unless it is verified and approved for public use.</p>
      <BilingualField label="Title" name="title" max={120} value={project?.title} />
      <BilingualField label="Description" name="description" max={600} value={project?.description} rows={3} />
      <BilingualField label="Verified location (optional)" name="location" max={120} value={project?.location} />
      <div className="admin-inset admin-stack">
        <h3>Project story</h3>
        <BilingualField label="Challenge" name="challenge" max={2500} value={project?.story.challenge} rows={3} />
        <BilingualField label="Approach" name="approach" max={2500} value={project?.story.approach} rows={3} />
        <BilingualField label="Outcome" name="outcome" max={2500} value={project?.story.outcome} rows={3} />
      </div>
      <fieldset className="admin-inset">
        <legend>Related services</legend>
        {services.map(service => (
          <label className="admin-check" key={service.slug}>
            <input type="checkbox" name="related_services" value={service.slug} defaultChecked={project?.related_services.includes(service.slug)} />
            {service.title.en}
          </label>
        ))}
      </fieldset>
      <details className="admin-inset">
        <summary>Search metadata (optional)</summary>
        <BilingualField label="SEO title" name="seo_title" max={90} value={project?.seo_title} />
        <BilingualField label="SEO description" name="seo_description" max={220} value={project?.seo_description} rows={2} />
      </details>
    </AdminForm>
  );
}

export function PublicationControls({ project, compact = false }: { project: ProjectRecord; compact?: boolean }) {
  const draft = project.status === 'draft';
  return (
    <div className="admin-stack">
      <div className="admin-row admin-actions">
        <Link className="button ghost" href={'/admin/projects/' + project.id + '/preview'}>Preview</Link>
        {!compact && !draft && <Link className="button ghost" href={'/en/projects/' + project.slug}>View public page</Link>}
      </div>
      <AdminForm action={changePublication} label={draft ? 'Publish project' : 'Unpublish project'}>
        <input type="hidden" name="id" value={project.id} />
        <input type="hidden" name="status" value={draft ? 'published' : 'draft'} />
        <input type="hidden" name="version" value={project.updated_at} />
        {draft && project.provenance === 'authentic' && (
          <label className="admin-check"><input name="verified" type="checkbox" value="yes" required />I confirm the work, any location shown, and photos are authentic and approved.</label>
        )}
      </AdminForm>
      {draft && (
        <details className="admin-inset">
          <summary>Delete draft</summary>
          <AdminForm action={deleteProject} label="Delete permanently" danger>
            <input type="hidden" name="id" value={project.id} />
            <input type="hidden" name="version" value={project.updated_at} />
            <label className="admin-check"><input name="confirm" type="checkbox" value="yes" required />Delete this draft and its CMS image records. Originals are retained in Cloudinary for recovery.</label>
          </AdminForm>
        </details>
      )}
    </div>
  );
}

function ImageCard({ image, readOnly }: { image: ImageRecord; readOnly: boolean }) {
  return (
    <article className="admin-inset admin-stack">
      <div className="admin-media-preview">
        <MediaImage src={'/admin/media/' + image.id} alt={image.alt.en} fill sizes="(max-width: 680px) 85vw, 440px" />
      </div>
      <p className="admin-help">{image.width} × {image.height} · {image.format.toUpperCase()}</p>
      {readOnly ? <p>{image.alt.en}</p> : (
        <>
          <AdminForm action={changeMedia} label="Save image details" protect>
            <input type="hidden" name="project" value={image.project_id} />
            <input type="hidden" name="image" value={image.id} />
            <input type="hidden" name="mode" value="save" />
            <BilingualField label="Alt text" name="alt" max={240} value={image.alt} required />
            <BilingualField label="Caption (optional)" name="caption" max={300} value={image.caption} />
            <label>Display order <input name="sort_order" type="number" min={0} max={10000} defaultValue={image.sort_order} /></label>
          </AdminForm>
          <details>
            <summary>Remove image</summary>
            <AdminForm action={changeMedia} label="Remove photograph" danger>
              <input type="hidden" name="project" value={image.project_id} />
              <input type="hidden" name="image" value={image.id} />
              <input type="hidden" name="mode" value="remove" />
              <label className="admin-check"><input name="confirm" type="checkbox" value="yes" required />Remove this photograph from the project.</label>
            </AdminForm>
          </details>
        </>
      )}
    </article>
  );
}

export function ProjectMedia({ project, cloudReady }: { project: ProjectRecord; cloudReady: boolean }) {
  const readOnly = project.status === 'published';
  const media = [...project.project_images].sort((a, b) => a.sort_order - b.sort_order || a.id.localeCompare(b.id));
  return (
    <div className="admin-panel admin-stack">
      <h2>Photographs</h2>
      <p className="admin-help">JPEG, PNG or WebP, up to 4 MB per file. Before and After must show the same view and have identical pixel dimensions. Use display order to arrange up to 24 gallery photographs.</p>
      {readOnly && <p className="admin-notice">Unpublish the project before changing media.</p>}
      {!cloudReady && <p className="admin-notice">Configure Cloudinary to upload and preview photographs.</p>}
      {imageRoles.map(role => {
        const images = media.filter(image => image.role === role);
        const nextOrder = Math.min(10000, (images.at(-1)?.sort_order ?? -10) + 10);
        return (
          <section key={role} className="admin-stack">
            <h3>{role === 'before' ? 'Before' : role === 'after' ? 'After' : 'Gallery'}</h3>
            {images.length ? <div className="admin-fields">{images.map(image => <ImageCard key={image.id} image={image} readOnly={readOnly} />)}</div> : <p className="admin-help">No photograph attached.</p>}
            {!readOnly && <ImageUpload projectId={project.id} role={role} order={nextOrder} disabled={!cloudReady || (role === 'gallery' && images.length >= 24)} />}
          </section>
        );
      })}
    </div>
  );
}
