import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { About, Contact, Footer, Header, Home, Products, ProjectDetail, Projects, ServiceDetail, Services } from '@/components/site';
import { brand, copy, pair, ui, type Locale, type Localized } from '@/content/site';
import { getPublishedProjects, getPublishedServices } from '@/lib/cms/public';
import { projectPhoto } from '@/content/project-media';
import { metadata, origin, publicPaths } from '@/content/config';
import { inquiryLink, whatsappCopy, type Inquiry } from '@/content/whatsapp';
import { WhatsAppWidget } from './whatsapp-widget';

export type RouteParams = Promise<{segments?:string[]}>;
export const buildParams = () => publicPaths.map(path=>({segments:path ? path.slice(1).split('/') : []}));
const pages={home:Home,services:Services,projects:Projects,products:Products,about:About,contact:Contact};
function preferred(override: Localized | undefined, fallback: Localized) {
  return pair(override?.en || fallback.en, override?.ar || fallback.ar);
}

async function resolve(locale: Locale, segments: string[] = []) {
  const path = segments.length ? '/' + segments.join('/') : '';
  if (segments.length === 2 && segments[0] === 'services') {
    const [services, projects] = await Promise.all([getPublishedServices(), getPublishedProjects()]);
    const service = services.find(item => item.slug === segments[1]);
    if (!service) notFound();
    return {
      locale, path, title: preferred(service.seo?.title, service.title), description: preferred(service.seo?.description, service.summary),
      image: service.art?.src, alt: service.art?.alt,
      inquiry: { kind: 'service' as const, name: service.title[locale] },
      view: <ServiceDetail item={service} locale={locale} serviceItems={services} projectItems={projects} />,
    };
  }
  if (segments.length === 2 && segments[0] === 'projects') {
    const [projects, services] = await Promise.all([getPublishedProjects(), getPublishedServices()]);
    const project = projects.find(item => item.slug === segments[1]);
    if (!project) notFound();
    const after = projectPhoto(project, 'after');
    return {
      locale, path, title: preferred(project.seo?.title, project.title), description: preferred(project.seo?.description, project.summary),
      image: after.src, alt: after.alt,
      inquiry: { kind: 'project' as const, name: project.title[locale] },
      view: <ProjectDetail item={project} locale={locale} serviceItems={services} projectItems={projects} />,
    };
  }

  const name = segments[0] ?? 'home';
  if (segments.length > 1 || (segments.length && name === 'home') || !Object.hasOwn(pages, name)) notFound();
  const key = name as keyof typeof pages;
  let view: ReactNode;
  if (key === 'home') {
    const [projects, services] = await Promise.all([getPublishedProjects(), getPublishedServices()]);
    view = <Home locale={locale} projectItems={projects} serviceItems={services} />;
  } else if (key === 'projects') {
    view = <Projects locale={locale} items={await getPublishedProjects()} />;
  } else if (key === 'services') {
    view = <Services locale={locale} items={await getPublishedServices()} />;
  } else if (key === 'contact') {
    view = <Contact locale={locale} serviceItems={await getPublishedServices()} />;
  } else {
    const Component = pages[key];
    view = <Component locale={locale} />;
  }
  const inquiry = key === 'products'
    ? { kind: 'product' as const, name: locale === 'ar' ? 'مستلزمات الحديقة' : 'garden essentials' }
    : undefined;
  return { locale, path, title: copy[key].title, description: copy[key].description, alt: copy.home.heroAlt, inquiry, view };
}

export async function pageMetadata(locale: Locale, { segments }: Awaited<RouteParams>) {
  const page = await resolve(locale, segments);
  return metadata(page.locale, page.path, page.title, page.description, page.image, page.alt);
}

function StructuredData({locale}: {locale:Locale}) {
  if(!origin) return null;
  const value={'@context':'https://schema.org','@graph':[
    {'@type':'WebSite','@id':origin+'/#website',name:brand.name,url:origin,inLanguage:['en','ar'],description:copy.home.description[locale]},
    {'@type':'Organization','@id':origin+'/#organization',name:brand.name,url:origin},
  ]};
  return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(value).replace(/</g,'\\u003c')}}/>;
}
export function Frame({
  locale, path, children, missing, inquiry,
}: { locale: Locale; path: string; children: ReactNode; missing?: boolean; inquiry?: Inquiry }) {
  const href = inquiryLink(locale, inquiry);
  return (
    <>
      <a className="skip" href="#main">{ui.skip[locale]}</a>
      <Header locale={locale} path={path} missing={missing} whatsappHref={href} />
      <main id="main" tabIndex={-1}>{children}</main>
      <Footer locale={locale} whatsappHref={href} />
      <WhatsAppWidget
        href={href}
        label={whatsappCopy.chat[locale]}
        unavailable={whatsappCopy.unavailable[locale]}
        dismiss={whatsappCopy.dismiss[locale]}
        reminders={whatsappCopy.reminders.map(message => message[locale])}
        route={locale + path}
      />
    </>
  );
}
export async function PublicPage({locale,segments}: {locale:Locale;segments?:string[]}) {
  const p=await resolve(locale,segments);
  return <Frame locale={p.locale} path={p.path} inquiry={p.inquiry}>{!p.path&&<StructuredData locale={p.locale}/>}{p.view}</Frame>;
}
