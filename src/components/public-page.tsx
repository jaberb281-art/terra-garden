import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { About, Contact, Footer, Header, Home, ProjectDetail, Projects, ServiceDetail, Services } from '@/components/site';
import { copy, pair, photo, ui, type Locale, type Localized } from '@/content/site';
import { getPublishedProjects, getPublishedServices } from '@/lib/cms/public';
import { projectPhoto } from '@/content/project-media';
import { serviceDisplay } from '@/content/service-display';
import { metadata, publicPaths } from '@/content/config';
import { pageBreadcrumbs, pageStructuredData, serializeStructuredData, type PageSeo } from '@/content/structured-data';
import { inquiryLink, whatsappCopy, type Inquiry } from '@/content/whatsapp';
import { WhatsAppWidget } from './whatsapp-widget';
import { Motion } from './motion';
import { Breadcrumbs } from './breadcrumbs';

export type RouteParams = Promise<{segments?:string[]}>;
export const buildParams = () => publicPaths.map(path=>({segments:path ? path.slice(1).split('/') : []}));
const pages={home:Home,services:Services,projects:Projects,about:About,contact:Contact};
function preferred(override: Localized | undefined, fallback: Localized) {
  return pair(override?.en || fallback.en, override?.ar || fallback.ar);
}

async function resolve(locale: Locale, segments: string[] = []) {
  const path = segments.length ? '/' + segments.join('/') : '';
  if (segments.length === 2 && segments[0] === 'services') {
    const [services, projects] = await Promise.all([getPublishedServices(), getPublishedProjects()]);
    const service = services.find(item => item.slug === segments[1]);
    if (!service) notFound();
    const art = service.art ?? { src: photo(serviceDisplay[service.slug].image), alt: serviceDisplay[service.slug].alt };
    return {
      locale, path, title: preferred(service.seo?.title, service.title), description: preferred(service.seo?.description, service.summary),
      image: art.src, alt: art.alt,
      breadcrumbTitle: service.title, service,
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
      breadcrumbTitle: project.title,
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
  const inquiry = undefined;
  return { locale, path, title: copy[key].title, description: copy[key].description, alt: copy.home.heroAlt, inquiry, view };
}

export async function pageMetadata(locale: Locale, { segments }: Awaited<RouteParams>) {
  const page = await resolve(locale, segments);
  return metadata(page.locale, page.path, page.title, page.description, page.image, page.alt);
}

function StructuredData({page}: {page:PageSeo}) {
  const value = pageStructuredData(page);
  if (!value) return null;
  return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:serializeStructuredData(value)}}/>;
}
export function Frame({
  locale, path, children, missing, inquiry,
}: { locale: Locale; path: string; children: ReactNode; missing?: boolean; inquiry?: Inquiry }) {
  const href = inquiryLink(locale, inquiry);
  return (
    <>
      <Motion />
      <a className="skip" href="#main">{ui.skip[locale]}</a>
      <Header locale={locale} path={path} missing={missing} whatsappHref={href} overlay={!path && !missing} />
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
  return <Frame locale={p.locale} path={p.path} inquiry={p.inquiry}><StructuredData page={p}/><Breadcrumbs locale={p.locale} items={pageBreadcrumbs(p)}/>{p.view}</Frame>;
}
