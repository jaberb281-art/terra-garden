import { business } from './business';
import { origin, socialImageUrl } from './config';
import { brand, copy, navigation, type Locale, type Localized } from './site';

export type Breadcrumb = { name: string; href: string };
export type PageSeo = {
  locale: Locale;
  path: string;
  title: Localized;
  description: Localized;
  breadcrumbTitle?: Localized;
  image?: string;
  service?: { title: Localized; summary: Localized };
};

export function pageBreadcrumbs({ locale, path, breadcrumbTitle, title }: PageSeo): Breadcrumb[] {
  if (!path) return [];
  const segments = path.slice(1).split('/');
  const crumbs = [{ name: navigation[0].label[locale], href: '/' + locale }];
  for (let index = 0; index < segments.length; index++) {
    const part = '/' + segments.slice(0, index + 1).join('/');
    const label = navigation.find(entry => entry.path === part)?.label;
    crumbs.push({ name: (label ?? breadcrumbTitle ?? title)[locale], href: '/' + locale + part });
  }
  return crumbs;
}

/** Only facts already shown by the site are included; no unverified address or ratings. */
export function pageStructuredData(page: PageSeo) {
  if (!origin) return undefined;
  const { locale, path, title, description, service } = page;
  const url = origin + '/' + locale + path;
  const organizationId = origin + '/#organization';
  const websiteId = origin + '/#website';
  const pageId = url + '#webpage';
  const image = socialImageUrl(page.image);
  const crumbs = pageBreadcrumbs(page);
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Organization', '@id': organizationId, name: brand.name, url: origin,
      telephone: business.phoneTel, email: business.email,
      areaServed: { '@type': 'Country', name: 'Qatar' },
      contactPoint: {
        '@type': 'ContactPoint', contactType: 'customer service',
        telephone: business.phoneTel, email: business.email, availableLanguage: ['en', 'ar'],
      },
    },
    {
      '@type': 'WebSite', '@id': websiteId, name: brand.name, url: origin,
      inLanguage: ['en', 'ar'], publisher: { '@id': organizationId }, description: copy.home.description[locale],
    },
    {
      '@type': path === '/about' ? 'AboutPage' : path === '/contact' ? 'ContactPage' : path === '/services' || path === '/projects' ? 'CollectionPage' : 'WebPage',
      '@id': pageId, url, name: title[locale], description: description[locale], inLanguage: locale,
      isPartOf: { '@id': websiteId }, about: { '@id': organizationId },
      ...(image ? { primaryImageOfPage: { '@type': 'ImageObject', url: image } } : {}),
      ...(crumbs.length ? { breadcrumb: { '@id': url + '#breadcrumb' } } : {}),
      ...(service ? { mainEntity: { '@id': url + '#service' } } : {}),
    },
  ];
  if (crumbs.length) graph.push({
    '@type': 'BreadcrumbList', '@id': url + '#breadcrumb',
    itemListElement: crumbs.map((crumb, index) => ({ '@type': 'ListItem', position: index + 1, name: crumb.name, item: origin + crumb.href })),
  });
  if (service) graph.push({
    '@type': 'Service', '@id': url + '#service', url, name: service.title[locale], description: service.summary[locale],
    provider: { '@id': organizationId }, areaServed: { '@type': 'Country', name: 'Qatar' },
    mainEntityOfPage: { '@id': pageId },
  });
  return { '@context': 'https://schema.org', '@graph': graph };
}

export function serializeStructuredData(value: NonNullable<ReturnType<typeof pageStructuredData>>) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
