import type { Localized } from '@/content/site';
import type { Project, ServiceSlug } from '@/content/catalog';

export type ImageRole = 'before' | 'after' | 'gallery';
export type Publication = 'draft' | 'published';
export type Story = Project['story'];

export interface ImageRecord {
  id: string;
  project_id: string;
  asset_id: string;
  public_id: string;
  role: ImageRole;
  width: number;
  height: number;
  bytes: number;
  format: 'jpg' | 'png' | 'webp';
  version: number;
  alt: Localized;
  caption: Localized;
  sort_order: number;
  created_at: string;
}

export interface ProjectRecord {
  id: string;
  slug: string;
  category: Project['category'];
  title: Localized;
  description: Localized;
  story: Story;
  location: Localized;
  related_services: ServiceSlug[];
  status: Publication;
  provenance: 'illustrative' | 'authentic';
  seo_title: Localized;
  seo_description: Localized;
  sort_order: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  project_images: ImageRecord[];
}

export interface ServiceRecord {
  slug: ServiceSlug;
  title: Localized;
  summary: Localized;
  detail: Localized;
  scope: Localized[];
  image: string;
  image_alt: Localized;
  seo_title: Localized;
  seo_description: Localized;
  status: Publication;
  sort_order: number;
  updated_at: string;
  service_faqs: { id: string; question: Localized; answer: Localized; sort_order: number }[];
}

export const categories = ['villas', 'commercial', 'farms'] as const;
export const imageRoles = ['before', 'after', 'gallery'] as const;
export const serviceImages = ['villa-after', 'patio-after', 'hero', 'nursery', 'farm-after'] as const;
export const CMS_TAG = 'terra-published-content';
export const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const reservedProjectSlugs = ['villa-garden-makeover', 'outdoor-living-renewal', 'farm-landscape-care'] as const;
export const imageWidths = [160, 256, 384, 640, 828, 1080, 1200, 1600, 1920] as const;

export function managedImageId(image: Pick<ImageRecord, 'project_id' | 'role' | 'public_id'>) {
  const prefix = 'terra/projects/' + image.project_id + '/' + image.role + '/';
  return uuidPattern.test(image.project_id) && imageRoles.includes(image.role) &&
    image.public_id.startsWith(prefix) && uuidPattern.test(image.public_id.slice(prefix.length));
}
