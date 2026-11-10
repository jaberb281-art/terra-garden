import type { MetadataRoute } from 'next';
import { origin, indexable, languageUrls, publicPaths } from '@/content/config';
import { locales } from '@/content/site';
import { getPublishedProjects } from '@/lib/cms/public';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if(!indexable) return [];
  const paths = new Set([...publicPaths, ...(await getPublishedProjects()).map(project => '/projects/' + project.slug)]);
  return [...paths].flatMap(path=>locales.map(locale=>({url:origin+'/'+locale+path,alternates:{languages:languageUrls(path)}})));
}
