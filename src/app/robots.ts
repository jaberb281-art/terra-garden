import type { MetadataRoute } from 'next';
import { indexable, origin } from '@/content/config';
export default function robots(): MetadataRoute.Robots {
  return indexable ? {rules:{userAgent:'*',allow:'/'},sitemap:origin+'/sitemap.xml'} : {rules:{userAgent:'*',disallow:'/'}};
}
