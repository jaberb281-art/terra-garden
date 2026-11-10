import 'server-only';

import { revalidatePath, updateTag } from 'next/cache';
import { CMS_TAG } from './records';
import { locales } from '@/content/site';

export function refreshPublic(slug?: { kind: 'projects' | 'services'; value: string }) {
  updateTag(CMS_TAG);
  for (const locale of locales) {
    revalidatePath('/' + locale);
    revalidatePath('/' + locale + '/projects');
    revalidatePath('/' + locale + '/services');
    revalidatePath('/' + locale + '/contact');
    if (slug) revalidatePath('/' + locale + '/' + slug.kind + '/' + slug.value);
  }
  revalidatePath('/sitemap.xml');
}
