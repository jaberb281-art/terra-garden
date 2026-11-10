import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { About, Contact, Footer, Header, Home, Products, ProjectDetail, Projects, ServiceDetail, Services } from '@/components/site';
import { brand, copy, ui, type Locale } from '@/content/site';
import { projects, services } from '@/content/catalog';
import { metadata, origin, publicPaths } from '@/content/config';
import { inquiryLink, whatsappCopy, type Inquiry } from '@/content/whatsapp';
import { WhatsAppWidget } from './whatsapp-widget';

export type RouteParams = Promise<{segments?:string[]}>;
export const buildParams = () => publicPaths.map(path=>({segments:path ? path.slice(1).split('/') : []}));
const pages={home:Home,services:Services,projects:Projects,products:Products,about:About,contact:Contact};
function resolve(locale:Locale,segments?:string[]) {
  const parts=segments??[];
  const path=parts.length ? '/'+parts.join('/') : '';
  if(parts.length===2 && parts[0]==='services') {
    const service=services.find(s=>s.slug===parts[1]);
    if(service) return {locale,path,title:service.title,description:service.summary,inquiry:{kind:'service' as const,name:service.title[locale]},view:<ServiceDetail item={service} locale={locale}/>};
  }
  if(parts.length===2 && parts[0]==='projects') {
    const project=projects.find(p=>p.slug===parts[1]);
    if(project) return {locale,path,title:project.title,description:project.summary,image:project.image+'-after',alt:project.afterAlt,inquiry:{kind:'project' as const,name:project.title[locale]},view:<ProjectDetail item={project} locale={locale}/>};
  }
  const name=parts[0]??'home';
  if(parts.length<=1 && (parts.length===0 || name!=='home') && Object.hasOwn(pages,name)) {
    const key=name as keyof typeof pages;
    const Component=pages[key];
    return {locale,path,title:copy[key].title,description:copy[key].description,alt:copy.home.heroAlt,inquiry:key === 'products' ? {kind:'product' as const,name:locale === 'ar' ? 'مستلزمات الحديقة' : 'garden essentials'} : undefined,view:<Component locale={locale}/>};
  }
  notFound();
}
export function pageMetadata(locale:Locale,{segments}:Awaited<RouteParams>) {
  const p=resolve(locale,segments);
  return metadata(p.locale,p.path,p.title,p.description,p.image,p.alt);
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
export function PublicPage({locale,segments}: {locale:Locale;segments?:string[]}) {
  const p=resolve(locale,segments);
  return <Frame locale={p.locale} path={p.path} inquiry={p.inquiry}>{!p.path&&<StructuredData locale={p.locale}/>}{p.view}</Frame>;
}
