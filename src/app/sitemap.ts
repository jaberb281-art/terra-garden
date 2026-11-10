import type { MetadataRoute } from 'next';
import { origin, indexable, languageUrls, publicPaths } from '@/content/config';
import { locales } from '@/content/site';
export default function sitemap(): MetadataRoute.Sitemap {
  if(!indexable) return [];
  return publicPaths.flatMap(path=>locales.map(locale=>({url:origin+'/'+locale+path,alternates:{languages:languageUrls(path)}})));
}
