import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Check, ClipboardCheck, ListChecks, Mail, MapPin, MessageCircle, Phone, Sprout } from 'lucide-react';
import { Fragment, type ReactNode } from 'react';
import { audienceMobile, brand, categories, copy, navigation, photo, ui, type Locale } from '@/content/site';
import { projects, services, type Project, type SiteService } from '@/content/catalog';
import { areas, areasCopy, business } from '@/content/business';
import { faqCopy, faqs } from '@/content/faq';
import { journey, serviceGuidance, servicePaths } from '@/content/journey';
import { Gallery, MobileNav, ProjectGrid, QuoteForm } from './controls';
import { serviceDisplay, serviceGroup, serviceUi, showServicePhotos, isFeatured } from '@/content/service-display';
import { Comparison, Featured } from './comparison';
import { LanguageSelect } from './language-select';
import { inquiryLink, whatsappCopy, whatsappNumber, type Inquiry } from '@/content/whatsapp';
import { WhatsAppAction } from './whatsapp-action';
import { Proof, TrustStrip } from './proof';
import { ServicesOverview } from './services-overview';
import { ProjectsOverview } from './projects-overview';
import { SocialPlaceholders } from './social-placeholders';

const local = (locale: Locale, path = '') => '/'+locale+path;
// Repeat the first photo at the end so the track can loop without a jump.
export function Brand({locale}: {locale: Locale}) {
  return <Link className="brand" href={local(locale)}><span className="brand-icon"><Sprout size={25} strokeWidth={1.45} aria-hidden="true"/></span><span><strong>{brand.name}</strong><small>{brand.subtitle[locale]}</small></span></Link>;
}
export function Header({locale,path,missing,whatsappHref,overlay}: {locale: Locale; path: string; missing?:boolean; whatsappHref?:string; overlay?:boolean}) {
  return <header className="site-header" data-overlay={overlay ? '' : undefined}>
    <div className="shell header-row">
      <Brand locale={locale}/>
      <nav className="desktop-nav" aria-label={ui.mainNav[locale]}>{navigation.map(n=><Link key={n.path} href={local(locale,n.path)} aria-current={!missing && path===n.path?'page':undefined} data-active={n.path!=='' && path.startsWith(n.path+'/') ? true : undefined}>{n.label[locale]}</Link>)}</nav>
      <div className="header-tools"><LanguageSelect locale={locale} path={path}/><a className="header-phone" href={'tel:' + business.phoneTel} dir="ltr">{business.phoneDisplay}</a><WhatsAppAction locale={locale} href={whatsappHref} label={whatsappCopy.quote[locale]} className="button primary header-cta"/><MobileNav locale={locale} path={missing ? '__missing__' : path}/></div>
    </div>
  </header>;
}
export function Footer({ locale, whatsappHref }: { locale: Locale; whatsappHref?: string }) {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div className="footer-brand"><Brand locale={locale} /><p><span className="footer-tagline-desktop">{ui.tagline[locale]}</span><span className="footer-tagline-mobile">{locale === 'ar' ? 'تنسيق الحدائق والعناية بها في أنحاء قطر.' : 'Garden care & landscaping across Qatar.'}</span></p><SocialPlaceholders locale={locale} /></div>
        <div className="footer-links">
          <h2>{ui.discover[locale]}</h2>
          <nav aria-label={ui.discover[locale]}>
            {navigation.filter(entry => entry.path).map(entry => (
              <Link key={entry.path} href={local(locale, entry.path)}>{entry.label[locale]}</Link>
            ))}
          </nav>
        </div>
        <div className="footer-contact">
          <h2>{ui.getInTouch[locale]}</h2>
          <p>{locale === 'ar' ? 'معاينة وعرض سعر مجانيان لحديقتك.' : 'Free garden inspection & quotation.'}</p>
          <WhatsAppAction locale={locale} href={whatsappHref} label={whatsappCopy.chat[locale]} className="button whatsapp-accent" />
          <ContactLines locale={locale} />
        </div>
      </div>
      <div className="shell footer-end"><span>© {brand.name}</span><span>{locale === 'ar' ? 'الدوحة، قطر' : 'Doha, Qatar'}</span></div>
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
const trimStop = (text: string) => text.replace(/[.。]\s*$/, '');

function ServiceCard({ locale, service, featured = false }: { locale: Locale; service: SiteService; featured?: boolean }) {
  const display = serviceDisplay[service.slug];
  const Icon = display.icon;
  const name = service.title[locale];
  const quote = inquiryLink(locale, { kind: 'service', name });
  const image = showServicePhotos ? (service.art ?? { src: photo(display.image), alt: display.alt }) : undefined;
  return (
    <article className="svc-card" data-group={serviceGroup(service.slug)} data-featured={featured ? '' : undefined}>
      {image && (
        <div className="svc-photo">
          <Image src={image.src} alt={image.alt[locale]} fill sizes="(max-width: 640px) 90vw, (max-width: 1000px) 44vw, 400px" style={display.focus ? { objectPosition: display.focus } : undefined} />
        </div>
      )}
      <div className="svc-body">
        <span className="svc-icon"><Icon size={featured ? 26 : 22} strokeWidth={1.7} aria-hidden="true" /></span>
        <h3><Link className="svc-link" href={local(locale, '/services/' + service.slug)}>{name}</Link></h3>
        <p>{service.summary[locale]}</p>
        {featured && (
          <ul className="svc-points">
            {service.scope.slice(0, 3).map(entry => (
              <li key={entry.en}><Check size={16} strokeWidth={2.2} aria-hidden="true" /><span>{trimStop(entry[locale])}</span></li>
            ))}
          </ul>
        )}
      </div>
      <div className="svc-foot">
        <WhatsAppAction locale={locale} href={quote} label={serviceUi.quote[locale]} subject={name} className="svc-quote" />
      </div>
    </article>
  );
}

function ServiceGrid({ locale, items = services, featured = false }: {
  locale: Locale;
  items?: readonly SiteService[];
  featured?: boolean;
}) {
  return (
    <div className="svc-grid">
      {items.map(service => (
        <ServiceCard key={service.slug} locale={locale} service={service} featured={featured && isFeatured(service.slug)} />
      ))}
    </div>
  );
}

// Home page services: filter tabs (CSS-only radios, no JavaScript) above a grid
// where the flagship services are featured.
function ServiceShowcase({ locale, items }: { locale: Locale; items: readonly SiteService[] }) {
  const ordered = [...items].sort((a, b) => serviceDisplay[a.slug].order - serviceDisplay[b.slug].order);
  return (
    <div className="svc-showcase">
      <div className="svc-tabs mobile-fit-bar" role="radiogroup" aria-label={serviceUi.filter[locale]}>
        <input className="sr-only" type="radio" name="svc-group" id="svc-all" defaultChecked />
        <label htmlFor="svc-all">{serviceUi.all[locale]}</label>
        {servicePaths.map(path => (
          <Fragment key={path.id}>
            <input className="sr-only" type="radio" name="svc-group" id={'svc-' + path.id} />
            <label htmlFor={'svc-' + path.id}>{path.choice[locale]}</label>
          </Fragment>
        ))}
      </div>
      <ServiceGrid locale={locale} items={ordered} featured />
    </div>
  );
}
function Audience({ locale }: { locale: Locale }) {
  return (
    <section className="section audience" id="audiences">
      <div className="shell">
        <SectionHead tag={locale === 'ar' ? 'لمن نقدم خدماتنا' : 'Who we care for'} title={<><span className="audience-desktop">{copy.home.audience[locale]}</span><span className="audience-mobile">{audienceMobile.title[locale]}</span></>} />
        <div className="audience-grid">
          {categories.map(category => {
            const project = projects.find(item => item.category === category.id);
            const href = project ? '/projects/' + project.slug : '/projects';
            return (
              <Link href={local(locale, href)} key={category.id} className="audience-card">
                <div className="audience-photo">
                  <Image src={photo(category.image)} alt={category.alt[locale]} fill sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 950px) 46vw, 55vw" />
                  <span className="photo-tag">{ui.sample[locale]}</span>
                </div>
                <div className="audience-copy">
                  <h3>{category.title[locale]}</h3>
                  <p className="audience-desktop">{category.copy[locale]}</p>
                  <p className="audience-mobile">{audienceMobile[category.id][locale]}</p>
                  <span className="audience-concept">{(project ? journey.concept : copy.home.allProjects)[locale]}<ArrowUpRight size={18} aria-hidden="true" /></span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
function Specialty({locale}: {locale:Locale}) {
  const h=copy.home;
  const palm = services.find(item => item.slug === 'date-palm-tree-care')!;
  return <section className="section supplies"><div className="shell split"><div className="split-image"><Image src={photo('farm-after')} alt={h.suppliesAlt[locale]} fill sizes="(max-width: 760px) 94vw, 570px"/><span className="photo-tag">{ui.sample[locale]}</span></div><div><p className="eyebrow">{locale==='ar'?'تخصصنا':'OUR SPECIALTY'}</p><h2>{h.supplies[locale]}</h2><p className="lead">{h.suppliesCopy[locale]}</p><ul className="supply-categories">{palm.scope.slice(0,4).map(item => <li key={item.en}>{item[locale]}</li>)}</ul><TextLink href={local(locale,'/services/date-palm-tree-care')}>{h.allProducts[locale]}</TextLink></div></div></section>;
}

function Areas({ locale }: { locale: Locale }) {
  return (
    <section className="section areas" aria-labelledby="areas-heading">
      <div className="shell">
        <SectionHead tag={areasCopy.tag[locale]} title={areasCopy.title[locale]} />
        <ul className="area-tags">{areas.map(area => <li key={area.en}><MapPin size={15} aria-hidden="true" />{area[locale]}</li>)}</ul>
        <p className="area-note">{areasCopy.note[locale]}</p>
      </div>
    </section>
  );
}

function Faq({ locale }: { locale: Locale }) {
  return (
    <section className="section faq home-faq">
      <div className="shell">
        <SectionHead tag={faqCopy.tag[locale]} title={faqCopy.title[locale]} />
        {faqs.map(([question, answer]) => (
          <details key={question.en}><summary>{question[locale]}</summary><p>{answer[locale]}</p></details>
        ))}
      </div>
    </section>
  );
}

function ContactLines({ locale }: { locale: Locale }) {
  return (
    <ul className="contact-lines">
      <li><Phone size={17} aria-hidden="true" /><a href={'tel:' + business.phoneTel} dir="ltr">{business.phoneDisplay}</a></li>
      <li><Mail size={17} aria-hidden="true" /><a href={'mailto:' + business.email} dir="ltr">{business.email}</a></li>
      <li><MapPin size={17} aria-hidden="true" /><span>{locale === 'ar' ? 'الدوحة، قطر' : 'Doha, Qatar'}</span></li>
    </ul>
  );
}
function Transformations({ locale, items }: { locale: Locale; items: readonly Project[] }) {
  const h = copy.home;
  const hasWork = items.some(item => !item.sample);
  return (
    <section className="section transformations" aria-labelledby="transformation-heading">
      <div className="shell transformation-shell">
        <p className="eyebrow">{locale === 'ar' ? 'قبل وبعد' : 'Before & after'}</p>
        <h2 id="transformation-heading">{h.transformations[locale]}</h2>
        <p className="lead">{hasWork
          ? (locale === 'ar' ? 'قارن بين صور قبل وبعد للمشاريع والتصورات التوضيحية.' : 'Compare before and after images from completed work and illustrative concepts.')
          : h.transformationCopy[locale]}</p>
        <Featured items={items} locale={locale} />
      </div>
    </section>
  );
}

const startIcons = [MapPin, ListChecks, ClipboardCheck];

function GetStarted({ locale }: { locale: Locale }) {
  return (
    <section className="section get-started" aria-labelledby="get-started-heading">
      <div className="shell">
        <h2 id="get-started-heading">{journey.startTitle[locale]}</h2>
        <p className="lead">{journey.startIntro[locale]}</p>
        <ol className="get-started-steps">
          {journey.startSteps.map((step, index) => {
            const Icon = startIcons[index];
            return (
              <li key={step.title.en}>
                <Icon size={22} strokeWidth={1.6} aria-hidden="true" />
                <h3>{step.title[locale]}</h3>
                <p>{step.copy[locale]}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

export function Home({locale, projectItems = projects, serviceItems = services}: {
  locale: Locale; projectItems?: readonly Project[]; serviceItems?: readonly SiteService[];
}) {
  const h=copy.home;
  const featured = projectItems.slice(0, 3);
  const hasWork = featured.some(item => !item.sample);
  return <>
    <section className="hero" aria-labelledby="home-hero-title">
      <figure className="hero-photo">
        <Image
          src={photo('hero')}
          alt={h.heroAlt[locale]}
          fill
          sizes="100vw"
          preload
        />
      </figure>
      <div className="hero-shade" aria-hidden="true" />
      <div className="shell hero-inner">
        <div className="hero-content">
          <p className="hero-trust">{h.heroTrust[locale]}</p>
          <h1 id="home-hero-title">{h.hero1[locale]}</h1>
          <p className="hero-note">{h.heroCopy[locale]}</p>
          <div className="actions">
            <WhatsAppAction locale={locale} href={inquiryLink(locale)} label={h.heroInquire[locale]} className="button hero-inquiry" />
            <Link className="button hero-more" href={local(locale, '/services')}>{h.heroLearn[locale]}<ArrowRight className="direction" size={17} aria-hidden="true" /></Link>
          </div>
        </div>
        <aside className="hero-cards" aria-label={h.heroEnquiries[locale]}>
          <div className="hero-card">
            <h2><MessageCircle size={16} strokeWidth={1.8} aria-hidden="true" />{h.heroEnquiries[locale]}</h2>
            <a href={'mailto:' + business.email}><Mail size={15} aria-hidden="true" />{h.heroEmail[locale]}</a>
            <a href={'tel:' + business.phoneTel}><Phone size={15} aria-hidden="true" />{h.heroCall[locale]}</a>
          </div>
        </aside>
      </div>
    </section>
    <TrustStrip locale={locale} />
    <section className="intro section">
      <div className="shell intro-grid">
        <div className="intro-card">
          <p className="eyebrow">{h.introTag[locale]}</p>
          <h2>{h.intro[locale]}</h2>
        </div>
        <div className="intro-card">
          <dl className="approach-steps">
            {copy.about.steps.map(([title, description]) => (
              <div key={title.en}><dt>{title[locale]}</dt><dd>{description[locale]}</dd></div>
            ))}
          </dl>
          <TextLink href={local(locale, '/services')}>{h.introLink[locale]}</TextLink>
        </div>
      </div>
    </section>
    <section className="section services-section home-services">
      <div className="shell">
        <SectionHead tag={copy.services.tag[locale]} title={h.services[locale] + ' ' + h.servicesAccent[locale]}>
          <TextLink href={local(locale, '/services')}>{h.allServices[locale]}</TextLink>
        </SectionHead>
        <ServiceShowcase locale={locale} items={serviceItems} />
      </div>
    </section>
    <Transformations locale={locale} items={featured} />
    <Audience locale={locale}/>
    <Proof locale={locale}/>
    <section className="section projects-section">
      <div className="shell">
        <SectionHead tag={hasWork ? (locale === 'ar' ? 'المشاريع والتصورات' : 'Work and concepts') : copy.projects.tag[locale]} title={h.gallery[locale]} description={hasWork ? undefined : h.galleryCopy[locale]}>
          <TextLink href={local(locale, '/projects')}>{(hasWork ? h.viewProjects : h.allProjects)[locale]}</TextLink>
        </SectionHead>
        <ProjectGrid items={featured} locale={locale} />
      </div>
    </section>
    <Specialty locale={locale} />
    <GetStarted locale={locale} />
    <Areas locale={locale} />
    <Faq locale={locale} />
    <CTA locale={locale}/>
  </>;
}
export function Services({ locale, items = services }: { locale: Locale; items?: readonly SiteService[] }) {
  return (
    <>
      <ServicesOverview locale={locale} items={items} />
      <CTA locale={locale} />
    </>
  );
}
export function ServiceDetail({ locale, item, serviceItems = services, projectItems = projects }: {
  locale: Locale; item: SiteService; serviceItems?: readonly SiteService[]; projectItems?: readonly Project[];
}) {
  const c = copy.services;
  const display = serviceDisplay[item.slug];
  const image = item.art ?? { src: photo(display.image), alt: display.alt };
  const guidance = serviceGuidance[item.slug];
  const faqs = item.faqs ?? [item.faq, guidance.faq];
  const examples = projectItems.filter(project => project.services.some(slug => slug === item.slug)).slice(0, 3);
  return (
    <>
      <PageIntro tag={c.tag[locale]} title={item.title[locale]} description={item.summary[locale]} image={{ src: image.src, alt: image.alt[locale], label: ui.sample[locale] }}>
        <TextLink href={local(locale, '/services')}>{copy.home.allServices[locale]}</TextLink>
      </PageIntro>
      <section className="section">
        <div className="shell detail-grid">
          <div className="service-guidance">
            <h2>{journey.suitable[locale]}</h2>
            <p className="lead">{guidance.suitable[locale]}</p>
            <p>{item.detail[locale]}</p>
          </div>
          <div>
            <h3 className="scope-heading">{c.scope[locale]}</h3>
            <ul className="scope-list">
              {item.scope.map(entry => <li key={entry.en}><Check size={19} aria-hidden="true" />{entry[locale]}</li>)}
            </ul>
          </div>
        </div>
        <div className="shell service-examples">
          <h3>{locale === 'ar' ? 'أمثلة ذات صلة' : 'Related examples'}</h3>
          <ConceptLinks locale={locale} items={examples} />
        </div>
      </section>
      <section className="section faq">
        <div className={faqs.length ? 'shell detail-grid' : 'shell'}>
          <div>
            <h2>{journey.prepare[locale]}</h2>
            <div className="service-guidance">
              <p className="lead">{guidance.prepare[locale]}</p>
              <p>{journey.commonDetails[locale]}</p>
              <p>{journey.next[locale]}</p>
            </div>
          </div>
          {faqs.length > 0 && <div>
            <h3>{c.faq[locale]}</h3>
            {faqs.map(([question, answer]) => (
              <details key={question.en}><summary>{question[locale]}</summary><p>{answer[locale]}</p></details>
            ))}
          </div>}
        </div>
      </section>
      <section className="section">
        <div className="shell">
          <SectionHead tag={c.tag[locale]} title={c.related[locale]} />
          <ServiceGrid items={serviceItems.filter(service => service.slug !== item.slug)} locale={locale} />
        </div>
      </section>
      <CTA locale={locale} inquiry={{ kind: 'service', name: item.title[locale] }} />
    </>
  );
}

function ConceptLinks({ locale, items }: { locale: Locale; items: readonly Project[] }) {
  return (
    <ul className="concept-links">
      {items.map(project => (
        <li key={project.slug}>
          <TextLink href={local(locale, '/projects/' + project.slug)}>{project.title[locale]}</TextLink>
        </li>
      ))}
    </ul>
  );
}
export function Projects({locale, items = projects}: {locale:Locale; items?: readonly Project[]}) {
  return <><ProjectsOverview locale={locale} items={items} /><CTA locale={locale}/></>;
}
export function ProjectDetail({ locale, item, serviceItems = services, projectItems = projects }: {
  locale: Locale; item: Project; serviceItems?: readonly SiteService[]; projectItems?: readonly Project[];
}) {
  const c = copy.projects;
  const category = categories.find(entry => entry.id === item.category);
  const storyLabels = {
    challenge: journey.challenge,
    approach: item.sample ? journey.approach : journey.work,
    outcome: item.sample ? journey.outcome : journey.result,
  };
  return (
    <>
      <PageIntro className="project-intro" tag={category?.title[locale] ?? c.tag[locale]} title={item.title[locale]} description={item.summary[locale]}>
        <TextLink href={local(locale, '/projects')}>{(item.sample ? copy.home.allProjects : copy.home.viewProjects)[locale]}</TextLink>
      </PageIntro>
      <section className="section project-section">
        <div className="shell project-detail">
          <Comparison locale={locale} project={item} />
          {item.sample && <p className="demo-note">{c.disclaimer[locale]}</p>}
          <div className="project-story">
            <div className="project-overview">
              <h2>{(item.sample ? c.overview : journey.caseStudy)[locale]}</h2>
              {item.location?.[locale] && <p>{item.location[locale]}</p>}
              <dl className="project-facts">
                {(['challenge', 'approach', 'outcome'] as const).map(part => (
                  <div key={part}>
                    <dt>{storyLabels[part][locale]}</dt>
                    <dd>{item.story[part][locale]}</dd>
                  </div>
                ))}
              </dl>
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
          <ServiceGrid locale={locale} items={serviceItems.filter(service => item.services.includes(service.slug))} />
          <div className="service-examples">
            <h3>{journey.moreConcepts[locale]}</h3>
            <ConceptLinks items={projectItems.filter(project => project.slug !== item.slug).slice(0, 3)} locale={locale} />
          </div>
        </div>
      </section>
      <CTA locale={locale} inquiry={{ kind: 'project', name: item.title[locale] }} />
    </>
  );
}
export function About({locale}: {locale:Locale}) {
  const c=copy.about;
  return <><PageIntro tag={c.tag[locale]} title={c.title[locale]} description={c.description[locale]}/><section className="section"><div className="shell split about-layout"><div className="split-image"><Image src={photo('hero')} alt={copy.home.heroAlt[locale]} fill sizes="(max-width: 760px) 94vw, 570px"/><span className="photo-tag">{ui.sample[locale]}</span></div><div><h2>{c.approach[locale]}</h2><p className="lead">{c.body[locale]}</p><div className="product-list">{c.steps.map(([title,body])=><article key={title.en}><div><h3>{title[locale]}</h3><p>{body[locale]}</p></div></article>)}</div></div></div></section><CTA locale={locale}/></>;
}
export function Contact({ locale, serviceItems = services }: { locale: Locale; serviceItems?: readonly SiteService[] }) {
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
            <ContactLines locale={locale} />
          </aside>
          <div className="quote-panel">
            <h2>{whatsappCopy.form[locale]}</h2>
            <p className="lead">{journey.formGuide[locale]}</p>
            <QuoteForm locale={locale} serviceItems={serviceItems} whatsappNumber={whatsappNumber} />
          </div>
        </div>
      </section>
    </>
  );
}
export function Missing({locale}: {locale:Locale}) {
  return <><PageIntro tag="404" title={ui.notFound[locale]} description={ui.lost[locale]}/><div className="shell missing-action"><Link className="button primary" href={local(locale)}>{ui.backHome[locale]}</Link></div></>;
}
