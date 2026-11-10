import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Check, CircleArrowRight, Droplet, Droplets, Flower2, Leaf, Scissors, Sprout } from 'lucide-react';
import type { ReactNode } from 'react';
import { brand, categories, copy, navigation, photo, ui, type Locale } from '@/content/site';
import { products, projects, services, type Service, type Project } from '@/content/catalog';
import { Gallery, MobileNav, ProjectGrid, QuoteForm } from './controls';
import { Comparison, Featured } from './comparison';
import { LanguageSelect } from './language-select';
import { inquiryLink, whatsappCopy, whatsappNumber, type Inquiry } from '@/content/whatsapp';
import { WhatsAppAction } from './whatsapp-action';

const local = (locale: Locale, path = '') => '/'+locale+path;
// Repeat the first photo at the end so the track can loop without a jump.
const heroSlides = ['hero', 'villa-after', 'patio-after', 'farm-after', 'nursery', 'hero'];
export function Brand({locale}: {locale: Locale}) {
  return <Link className="brand" href={local(locale)}><span className="brand-icon"><Sprout size={25} strokeWidth={1.45} aria-hidden="true"/></span><span><strong>{brand.name}</strong><small>{brand.subtitle[locale]}</small></span></Link>;
}
export function Header({locale,path,missing,whatsappHref}: {locale: Locale; path: string; missing?:boolean; whatsappHref?:string}) {
  return <header className="site-header">
    <div className="shell header-row">
      <Brand locale={locale}/>
      <nav className="desktop-nav" aria-label={ui.mainNav[locale]}>{navigation.map(n=><Link key={n.path} href={local(locale,n.path)} aria-current={!missing && path===n.path?'page':undefined} data-active={n.path!=='' && path.startsWith(n.path+'/') ? true : undefined}>{n.label[locale]}</Link>)}</nav>
      <div className="header-tools"><LanguageSelect locale={locale} path={path}/><WhatsAppAction locale={locale} href={whatsappHref} label={whatsappCopy.quote[locale]} className="button primary header-cta"/><MobileNav locale={locale} path={missing ? '__missing__' : path}/></div>
    </div>
  </header>;
}
export function Footer({ locale, whatsappHref }: { locale: Locale; whatsappHref?: string }) {
  return (
    <footer>
      <div className="shell footer-grid">
        <div><Brand locale={locale} /><p>{ui.tagline[locale]}</p></div>
        <div>
          <h2>{ui.discover[locale]}</h2>
          <nav aria-label={ui.discover[locale]}>
            {navigation.filter(entry => entry.path && entry.path !== '/projects').map(entry => (
              <Link key={entry.path} href={local(locale, entry.path)}>{entry.label[locale]}</Link>
            ))}
          </nav>
        </div>
        <div className="footer-contact">
          <h2>{ui.getInTouch[locale]}</h2>
          <p>{whatsappCopy.footer[locale]}</p>
          <WhatsAppAction locale={locale} href={whatsappHref} label={whatsappCopy.chat[locale]} className="button whatsapp-accent" />
          {whatsappHref && <bdi className="whatsapp-number" dir="ltr">+{whatsappNumber}</bdi>}
          <Link className="footer-projects" href={local(locale, '/projects')}>
            {copy.home.allProjects[locale]} <ArrowRight className="direction" size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>
      <div className="shell footer-end"><span>© {brand.name} · {brand.subtitle[locale]}</span><span>{ui.place[locale]}</span></div>
    </footer>
  );
}

function CTA({ locale, inquiry }: { locale: Locale; inquiry?: Inquiry }) {
  const label = inquiry?.kind === 'service' ? whatsappCopy.service[locale] :
    inquiry?.kind === 'project' ? whatsappCopy.project[locale] :
    locale === 'ar' ? 'راسلنا عبر واتساب' : 'WhatsApp us';

  return (
    <section className="cta">
      <div className="shell cta-content">
        <div className="cta-brand">
          <span lang="en">{brand.name}</span>
          <p>{brand.subtitle[locale]}</p>
        </div>
        <p className="eyebrow cta-kicker">{copy.contact.tag[locale]}</p>
        <h2>{ui.contactTitle[locale]}</h2>
        <p className="cta-description">{ui.contactCopy[locale]}</p>
        <div className="cta-actions">
          <WhatsAppAction locale={locale} href={inquiryLink(locale, inquiry)} label={label} className="button primary cta-whatsapp" />
          <Link className="cta-projects" href={local(locale, '/projects')}>
            {locale === 'ar' ? 'شاهد المشاريع' : 'View projects'}
          </Link>
        </div>
      </div>
    </section>
  );
}
export function PageIntro({tag,title,description,children, image, className}: {tag:string;title:string;description:string;children?:ReactNode;image?:{src:string;alt:string;label:string};className?:string}) {
  return <div className={className ? "page-intro " + className : "page-intro"}><div className={image ? "shell page-intro-split" : "shell"}><div>{children}<p className="eyebrow">{tag}</p><h1>{title}</h1><p className="lead">{description}</p></div>{image && <div className="page-intro-image"><Image src={image.src} alt={image.alt} fill sizes="(max-width: 760px) 90vw, 500px"/><span className="photo-tag">{image.label}</span></div>}</div></div>;
}
function SectionHead({tag,title,description,children}: {tag:string;title:ReactNode;description?:string;children?:ReactNode}) {
  return <div className="section-head"><div><p className="eyebrow">{tag}</p><h2>{title}</h2>{description&&<p className="lead">{description}</p>}</div>{children}</div>;
}
function TextLink({href,children}: {href:string;children:ReactNode}) {
  return <Link className="text-link" href={href}>{children} <ArrowRight className="direction" size={16} aria-hidden="true"/></Link>;
}
const serviceArt = [
  { image: 'villa-after', alt: projects[0].afterAlt, icon: Scissors },
  { image: 'patio-after', alt: projects[1].afterAlt, icon: Leaf },
  { image: 'hero', alt: copy.home.heroAlt, icon: Sprout },
  { image: 'nursery', alt: copy.home.suppliesAlt, icon: Droplet },
];

function ServiceGrid({ locale, items = services, editorial = false }: {
  locale: Locale;
  items?: readonly Service[];
  editorial?: boolean;
}) {
  return (
    <div className="grid services-grid">
      {items.map(service => {
        const art = serviceArt[services.findIndex(entry => entry.slug === service.slug)];
        const ServiceIcon = art.icon;
        return (
          <article className="service-card" key={service.slug}>
            <Link href={local(locale, '/services/' + service.slug)}>
              <div className="service-photo">
                <Image src={photo(art.image)} alt={art.alt[locale]} fill sizes="(max-width: 540px) 90vw, (max-width: 940px) 44vw, 310px" />
                <span className="photo-tag">{ui.sample[locale]}</span>
              </div>
              {editorial ? (
                <div className="service-card-copy service-card-editorial">
                  <ServiceIcon className="service-card-icon" size={23} strokeWidth={1.65} aria-hidden="true" />
                  <div>
                    <h3>{service.title[locale]}</h3>
                    <p>{service.summary[locale]}</p>
                  </div>
                  <CircleArrowRight className="service-card-arrow direction" size={19} strokeWidth={1.65} aria-hidden="true" />
                </div>
              ) : (
                <div className="service-card-copy">
                  <h3>{service.title[locale]}</h3>
                  <ArrowUpRight className="card-arrow" size={18} aria-hidden="true" />
                  <p>{service.summary[locale]}</p>
                </div>
              )}
            </Link>
          </article>
        );
      })}
    </div>
  );
}
function Audience({locale}: {locale:Locale}) {
  return <section className="section audience" id="audiences"><div className="shell"><SectionHead tag={locale==='ar'?'لمن نقدم خدماتنا':'WHO WE CARE FOR'} title={copy.home.audience[locale]}/><div className="audience-grid">{categories.map(c=><Link href={local(locale,'/projects/'+projects.find(p=>p.category===c.id)?.slug)} key={c.id} className="audience-card"><div className="audience-photo"><Image src={photo(c.image)} alt={c.alt[locale]} fill sizes="(max-width: 620px) 94vw, (max-width: 950px) 46vw, 380px"/><span className="photo-tag">{ui.sample[locale]}</span></div><div className="audience-copy"><h3>{c.title[locale]}</h3><p>{c.copy[locale]}</p><ArrowUpRight size={18} aria-hidden="true"/></div></Link>)}</div></div></section>;
}
function Supplies({locale}: {locale:Locale}) {
  const h=copy.home;
  return <section className="section supplies"><div className="shell split"><div className="split-image"><Image src={photo('nursery')} alt={h.suppliesAlt[locale]} fill sizes="(max-width: 760px) 94vw, 570px"/><span className="photo-tag">{ui.sample[locale]}</span></div><div><p className="eyebrow">{copy.products.tag[locale]}</p><h2>{h.supplies[locale]}</h2><p className="lead">{h.suppliesCopy[locale]}</p><ul className="supply-categories">{products.map(item => <li key={item.title.en}>{item.title[locale]}</li>)}</ul><TextLink href={local(locale,'/products')}>{h.allProducts[locale]}</TextLink></div></div></section>;
}
function Transformations({ locale }: { locale: Locale }) {
  const h = copy.home;
  return (
    <section className="section transformations" aria-labelledby="transformation-heading">
      <div className="shell transformation-shell">
        <p className="eyebrow">{locale === 'ar' ? 'قبل وبعد' : 'Before & after'}</p>
        <h2 id="transformation-heading">{h.transformations[locale]}</h2>
        <p className="lead">{h.transformationCopy[locale]}</p>
        <Featured items={projects} locale={locale} />
      </div>
    </section>
  );
}

export function Home({locale}: {locale:Locale}) {
  const h=copy.home;
  const pauseSlides = locale === 'ar' ? 'إيقاف عرض الصور مؤقتاً' : 'Pause image slideshow';
  return <>
    <section className="hero">
      <div className="shell hero-inner">
        <div className="hero-content">
          <p className="eyebrow hero-kicker">{ui.top[locale]}</p>
          <h1>{h.hero1[locale]} <span>{h.hero2[locale]}</span></h1>
          <p className="hero-copy">{h.heroCopy[locale]}</p>
          <div className="actions">
            <WhatsAppAction locale={locale} href={inquiryLink(locale)} label={whatsappCopy.hero[locale]} className="button primary" />
            <Link className="button ghost" href={local(locale, '/projects')}>{h.viewProjects[locale]}</Link>
          </div>
        </div>
        <figure className="hero-photo">
          <label className="hero-slide-pause">
            <input className="sr-only" type="checkbox" aria-label={pauseSlides} />
            <span aria-hidden="true">{pauseSlides}</span>
          </label>
          <div className="hero-photo-track" dir="ltr">
            {heroSlides.map((image, index) => (
              <div className="hero-photo-slide" key={index}>
                <Image
                  src={photo(image)}
                  alt={index === 0 ? h.heroAlt[locale] : ''}
                  fill
                  sizes="(max-width: 820px) 91vw, (max-width: 1400px) 47vw, 660px"
                  preload={index === 0}
                  fetchPriority={index === 0 ? undefined : 'low'}
                />
              </div>
            ))}
          </div>
          <figcaption className="photo-tag">{ui.sample[locale]}</figcaption>
        </figure>
      </div>
    </section>
    <section className="intro section">
      <div className="shell intro-grid">
        <div className="intro-card">
          <p className="eyebrow">{h.introTag[locale]}</p>
          <h2>{h.intro[locale]}</h2>
        </div>
        <div className="intro-card">
          <p className="lead">{h.introCopy[locale]}</p>
          <TextLink href={local(locale, '/services')}>{h.introLink[locale]}</TextLink>
        </div>
      </div>
    </section>
    <section className="section services-section home-services">
      <div className="shell">
        <SectionHead tag={copy.services.tag[locale]} title={<>{h.services[locale]} <span>{h.servicesAccent[locale]}</span></>}>
          <TextLink href={local(locale, '/services')}>{h.allServices[locale]}</TextLink>
        </SectionHead>
        <ServiceGrid locale={locale} editorial />
      </div>
    </section>
    <Transformations locale={locale} />
    <Audience locale={locale}/>
    <Supplies locale={locale}/>
    <section className="section projects-section"><div className="shell"><SectionHead tag={copy.projects.tag[locale]} title={h.gallery[locale]}><TextLink href={local(locale,'/projects')}>{h.allProjects[locale]}</TextLink></SectionHead><ProjectGrid items={projects} locale={locale}/></div></section>
    <CTA locale={locale}/>
  </>;
}
export function Services({locale}: {locale:Locale}) {
  const c=copy.services;
  return <><PageIntro tag={c.tag[locale]} title={c.title[locale]} description={c.description[locale]}/><section className="section"><div className="shell"><h2 className="sr-only">{c.scope[locale]}</h2><ServiceGrid locale={locale}/></div></section><Audience locale={locale}/><CTA locale={locale}/></>;
}
export function ServiceDetail({locale,item}: {locale:Locale;item:Service}) {
  const c=copy.services;
  const art = serviceArt[services.findIndex(service => service.slug === item.slug)];
  return <><PageIntro tag={c.tag[locale]} title={item.title[locale]} description={item.summary[locale]} image={{src:photo(art.image),alt:art.alt[locale],label:ui.sample[locale]}}><TextLink href={local(locale,'/services')}>{copy.home.allServices[locale]}</TextLink></PageIntro><section className="section"><div className="shell detail-grid"><div><h2>{c.scope[locale]}</h2><p className="lead">{item.detail[locale]}</p></div><ul className="scope-list">{item.scope.map(s=><li key={s.en}><Check size={19} aria-hidden="true"/>{s[locale]}</li>)}</ul></div></section><section className="section faq"><div className="shell"><h2>{c.faq[locale]}</h2><details><summary>{item.faq[0][locale]}</summary><p>{item.faq[1][locale]}</p></details></div></section><section className="section"><div className="shell"><SectionHead tag={c.tag[locale]} title={c.related[locale]}/><ServiceGrid items={services.filter(s=>s.slug!==item.slug)} locale={locale}/></div></section><CTA locale={locale} inquiry={{kind:'service',name:item.title[locale]}}/></>;
}
export function Projects({locale}: {locale:Locale}) {
  const c=copy.projects;
  return <><PageIntro tag={c.tag[locale]} title={c.title[locale]} description={c.description[locale]}/><section className="section"><div className="shell"><h2 className="sr-only">{c.tag[locale]}</h2><p className="demo-note">{c.disclaimer[locale]}</p><ProjectGrid items={projects} locale={locale} filter/></div></section><CTA locale={locale}/></>;
}
export function ProjectDetail({ locale, item }: { locale: Locale; item: Project }) {
  const c = copy.projects;
  const category = categories.find(entry => entry.id === item.category);
  return (
    <>
      <PageIntro className="project-intro" tag={category?.title[locale] ?? c.tag[locale]} title={item.title[locale]} description={item.summary[locale]}>
        <TextLink href={local(locale, '/projects')}>{copy.home.allProjects[locale]}</TextLink>
      </PageIntro>
      <section className="section project-section">
        <div className="shell project-detail">
          <Comparison locale={locale} project={item} />
          {item.sample && <p className="demo-note">{c.disclaimer[locale]}</p>}
          <div className="project-story">
            <div className="project-overview">
              <h2>{c.overview[locale]}</h2>
              <p className="lead">{item.detail[locale]}</p>
            </div>
            <div>
              <h2>{ui.gallery[locale]}</h2>
              <Gallery locale={locale} project={item} />
            </div>
          </div>
        </div>
      </section>
      <section className="section services-section">
        <div className="shell">
          <SectionHead tag={copy.services.tag[locale]} title={copy.services.related[locale]} />
          <ServiceGrid locale={locale} items={services.filter(service => item.services.includes(service.slug))} />
        </div>
      </section>
      <section className="section related-projects">
        <div className="shell">
          <SectionHead tag={c.tag[locale]} title={locale === 'ar' ? 'تصورات أخرى للحدائق' : 'More garden concepts'} />
          <ProjectGrid items={projects.filter(project => project.slug !== item.slug)} locale={locale} />
        </div>
      </section>
      <CTA locale={locale} inquiry={{ kind: 'project', name: item.title[locale] }} />
    </>
  );
}
const productIcons=[Sprout,Leaf,Flower2,Droplets];
export function Products({ locale }: { locale: Locale }) {
  const c = copy.products;
  return (
    <>
      <PageIntro tag={c.tag[locale]} title={c.title[locale]} description={c.description[locale]} />
      <section className="section">
        <div className="shell split catalogue-layout">
          <div className="split-image">
            <Image src={photo('nursery')} alt={copy.home.suppliesAlt[locale]} fill sizes="(max-width: 760px) 94vw, 570px" />
            <span className="photo-tag">{ui.sample[locale]}</span>
          </div>
          <div>
            <h2>{c.tag[locale]}</h2>
            <p className="lead">{c.note[locale]}</p>
            <div className="product-list">
              {products.map((product, index) => {
                const Icon = productIcons[index];
                const title = product.title[locale];
                return (
                  <article key={product.title.en}>
                    <span className="tile-icon"><Icon size={22} aria-hidden="true" /></span>
                    <div><h3>{title}</h3><p>{product.copy[locale]}</p></div>
                    <WhatsAppAction
                      locale={locale}
                      href={inquiryLink(locale, { kind: 'product', name: title })}
                      label={whatsappCopy.product[locale]}
                      subject={title}
                      className="whatsapp-product"
                    />
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
export function About({locale}: {locale:Locale}) {
  const c=copy.about;
  return <><PageIntro tag={c.tag[locale]} title={c.title[locale]} description={c.description[locale]}/><section className="section"><div className="shell split about-layout"><div className="split-image"><Image src={photo('hero')} alt={copy.home.heroAlt[locale]} fill sizes="(max-width: 760px) 94vw, 570px"/><span className="photo-tag">{ui.sample[locale]}</span></div><div><h2>{c.approach[locale]}</h2><p className="lead">{c.body[locale]}</p><div className="product-list">{c.steps.map(([title,body])=><article key={title.en}><div><h3>{title[locale]}</h3><p>{body[locale]}</p></div></article>)}</div></div></div></section><CTA locale={locale}/></>;
}
export function Contact({ locale }: { locale: Locale }) {
  const c = copy.contact;
  const href = inquiryLink(locale);
  return (
    <>
      <PageIntro tag={c.tag[locale]} title={c.title[locale]} description={c.description[locale]} />
      <section className="section contact-section">
        <div className="shell contact-grid">
          <aside className="contact-whatsapp">
            <div>
              <h2>{whatsappCopy.chat[locale]}</h2>
              <p>{(href ? whatsappCopy.contact : whatsappCopy.unavailableDetail)[locale]}</p>
            </div>
            <div className="contact-whatsapp-action">
              <WhatsAppAction locale={locale} href={href} label={whatsappCopy.chat[locale]} className="button whatsapp-accent" />
              {href && <bdi className="whatsapp-number" dir="ltr">+{whatsappNumber}</bdi>}
            </div>
          </aside>
          <div className="quote-panel">
            <h2>{whatsappCopy.form[locale]}</h2>
            <QuoteForm locale={locale} />
          </div>
        </div>
      </section>
    </>
  );
}
export function Missing({locale}: {locale:Locale}) {
  return <><PageIntro tag="404" title={ui.notFound[locale]} description={ui.lost[locale]}/><div className="shell missing-action"><Link className="button primary" href={local(locale)}>{ui.backHome[locale]}</Link></div></>;
}
