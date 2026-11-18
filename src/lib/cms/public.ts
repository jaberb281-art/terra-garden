import 'server-only';

import { cache } from 'react';
import { projects, services, type Project, type ProjectPhoto, type SiteService } from '@/content/catalog';
import { photo } from '@/content/site';
import { cloudinaryConfig, supabaseConfig } from './env';
import { CMS_TAG, managedImageId, type ImageRecord, type ProjectRecord, type ServiceRecord } from './records';

type Table = 'projects' | 'services' | 'project_images';

async function publicRows<Row>(table: Table, query: Record<string, string>, fresh = false): Promise<Row[] | null> {
  const config = supabaseConfig();
  if (!config) return null;
  const url = new URL('/rest/v1/' + table, config.url);
  url.search = new URLSearchParams(query).toString();
  try {
    const response = await fetch(url, {
      headers: { apikey: config.key },
      signal: AbortSignal.timeout(5000),
      ...(fresh ? { cache: 'no-store' as const } : { next: { tags: [CMS_TAG], revalidate: 300 } }),
    });
    if (response.ok) return await response.json() as Row[];
    console.warn('TERRA public CMS query failed:', table, response.status);
  } catch {
    console.warn('TERRA public CMS query unavailable:', table);
  }
  return null;
}

function imagePhoto(image: ImageRecord, preview: boolean): ProjectPhoto {
  return {
    src: (preview ? '/admin/media/' : '/media/project-images/') + image.id,
    alt: image.alt, caption: image.caption, width: image.width, height: image.height,
  };
}

export function projectFromRecord(row: ProjectRecord, preview = false): Project | null {
  const rows = [...row.project_images].filter(managedImageId)
    .sort((a, b) => a.sort_order - b.sort_order || a.id.localeCompare(b.id));
  const before = rows.find(image => image.role === 'before');
  const after = rows.find(image => image.role === 'after');
  if (!before || !after || before.width !== after.width || before.height !== after.height) return null;
  return {
    slug: row.slug, category: row.category, title: row.title, summary: row.description,
    story: row.story, image: '', beforeAlt: before.alt, afterAlt: after.alt,
    services: row.related_services, sample: row.provenance === 'illustrative', location: row.location,
    seo: { title: row.seo_title, description: row.seo_description },
    media: {
      before: imagePhoto(before, preview),
      after: imagePhoto(after, preview),
      gallery: rows.filter(image => image.role === 'gallery').map(image => imagePhoto(image, preview)),
    },
  };
}

export const getPublishedProjects = cache(async (): Promise<readonly Project[]> => {
  if (!cloudinaryConfig()) return projects;
  const records = await publicRows<ProjectRecord>('projects', {
    select: '*,project_images(*)',
    status: 'eq.published',
    order: 'sort_order.asc,published_at.desc,id.asc',
  });
  const managed = (records ?? []).flatMap(row => projectFromRecord(row) ?? []);
  // Authentic work takes priority. Existing examples keep their URLs and labels.
  return [...managed.filter(item => !item.sample), ...managed.filter(item => item.sample), ...projects];
});

export const getPublishedServices = cache(async (): Promise<readonly SiteService[]> => {
  const records = await publicRows<ServiceRecord>('services', {
    select: '*,service_faqs(*)', status: 'eq.published', order: 'sort_order.asc,slug.asc',
  });
  if (!records) return services;
  const managed = records.flatMap(row => {
    const baseline = services.find(service => service.slug === row.slug);
    if (!baseline) return [];
    const faqs = [...row.service_faqs].sort((a, b) => a.sort_order - b.sort_order || a.id.localeCompare(b.id))
      .map(faq => [faq.question, faq.answer] as const);
    return [{
      ...baseline, title: row.title, summary: row.summary, detail: row.detail, scope: row.scope, faqs,
      art: { src: photo(row.image), alt: row.image_alt },
      seo: { title: row.seo_title, description: row.seo_description },
    }];
  });
  return [...managed, ...services.filter(baseline => !managed.some(service => service.slug === baseline.slug))];
});

export async function publishedImage(id: string) {
  const rows = await publicRows<ImageRecord>('project_images', { select: '*', id: 'eq.' + id, limit: '1' }, true);
  return rows?.[0] ?? null;
}
