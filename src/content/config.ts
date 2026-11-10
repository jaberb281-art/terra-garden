import type { Metadata } from 'next';
import { brand, photo, type Locale, type Localized } from './site';
import { projects, services } from './catalog';

function verifiedOrigin(value: string | undefined) {
  try {
    const url = new URL(value ?? '');
    const host = url.hostname;
    if (url.protocol !== 'https:' || url.username || url.password || url.port || url.pathname !== '/' || url.search || url.hash) return undefined;
    if (!host.includes('.') || /(^|\.)(localhost|example\.(com|org|net)|test|invalid|example|local)$/.test(host) || /^[\d.]+$/.test(host)) return undefined;
    return url.origin;
  } catch { return undefined; }
}
export const origin = verifiedOrigin(process.env.NEXT_PUBLIC_SITE_URL);
export const indexable = !!origin && process.env.SITE_ALLOW_INDEXING === 'true';
export const publicPaths = [
  '', '/services', '/projects', '/products', '/about', '/contact',
  ...services.map(s=>'/services/'+s.slug), ...projects.map(p=>'/projects/'+p.slug),
];
export function languageUrls(path: string) {
  return { en: origin+'/en'+path, ar: origin+'/ar'+path, 'x-default': origin+'/en'+path };
}
export function metadata(locale:Locale,path:string,title:Localized,description:Localized,image='hero',alt?:Localized): Metadata {
  const fullTitle=title[locale]+' | '+brand.name;
  const url=origin ? origin+'/'+locale+path : undefined;
  const imagePath = image.startsWith('/') ? image : photo(image);
  const images=origin ? [{url:origin+imagePath, alt:alt?.[locale]??title[locale]}] : undefined;
  return {
    title:fullTitle, description:description[locale],
    robots:{index:indexable,follow:indexable},
    alternates:url?{canonical:url,languages:languageUrls(path)}:undefined,
    openGraph:{title:fullTitle,description:description[locale],siteName:brand.name,locale:locale==='ar'?'ar_QA':'en_QA',alternateLocale:[locale==='ar'?'en_QA':'ar_QA'],type:'website',url,images},
    twitter:{card:'summary_large_image',title:fullTitle,description:description[locale],images},
  };
}
