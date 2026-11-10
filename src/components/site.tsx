import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Check, CircleArrowRight, ClipboardCheck, Droplet, Droplets, Flower2, Leaf, ListChecks, MapPin, Scissors, Sprout } from 'lucide-react';
import type { ReactNode } from 'react';
import { brand, categories, copy, navigation, photo, ui, type Locale } from '@/content/site';
import { products, projects, services, type Service, type Project, type SiteService } from '@/content/catalog';
import { journey, serviceGuidance, servicePaths } from '@/content/journey';
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
        const image = service.art ?? { src: photo(art.image), alt: art.alt };
        return (
          <article className="service-card" key={service.slug}>
            <Link href={local(locale, '/services/' + service.slug)}>
              <div className="service-photo">
                <Image src={image.src} alt={image.alt[locale]} fill sizes={items.length === 2
                  ? '(max-width: 540px) 90vw, (max-width: 1380px) 44vw, 610px'
                  : '(max-width: 540px) 90vw, (max-width: 940px) 44vw, 310px'} />
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
function ServiceChoices({ locale, onOverview = false }: { locale: Locale; onOverview?: boolean }) {
  return (
    <nav className="service-choices" aria-label={journey.choose[locale]}>
      <p>{journey.choose[locale]}</p>
      <ul>
        {servicePaths.map(path => (
          <li key={path.id}>
            <Link className="button ghost" href={(onOverview ? '' : local(locale, '/services')) + '#' + path.id}>
              {path.choice[locale]} <ArrowRight className="direction" size={15} aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Audience({ locale }: { locale: Locale }) {
  return (
    <section className="section audience" id="audiences">
      <div className="shell">
        <SectionHead tag={locale === 'ar' ? 'لمن نقدم خدماتنا' : 'Who we care for'} title={copy.home.audience[locale]} />
        <div className="audience-grid">
          {categories.map(category => {
            const project = projects.find(item => item.category === category.id);
            const href = project ? '/projects/' + project.slug : '/projects';
            return (
              <Link href={local(locale, href)} key={category.id} className="audience-card">
                <div className="audience-photo">
                  <Image src={photo(category.image)} alt={category.alt[locale]} fill sizes="(max-width: 620px) 94vw, (max-width: 950px) 46vw, 380px" />
                  <span className="photo-tag">{ui.sample[locale]}</span>
                </div>
                <div className="audience-copy">
                  <h3>{category.title[locale]}</h3>
                  <p>{category.copy[locale]}</p>
                  <span className="audience-concept">{(project ? journey.concept : copy.home.allProjects)[locale]}</span>
                  <ArrowUpRight size={18} aria-hidden="true" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
function Supplies({locale}: {locale:Locale}) {
  const h=copy.home;
  return <section className="section supplies"><div className="shell split"><div className="split-image"><Image src={photo('nursery')} alt={h.suppliesAlt[locale]} fill sizes="(max-width: 760px) 94vw, 570px"/><span className="photo-tag">{ui.sample[locale]}</span></div><div><p className="eyebrow">{copy.products.tag[locale]}</p><h2>{h.supplies[locale]}</h2><p className="lead">{h.suppliesCopy[locale]}</p><ul className="supply-categories">{products.map(item => <li key={item.title.en}>{item.title[locale]}</li>)}</ul><TextLink href={local(locale,'/products')}>{h.allProducts[locale]}</TextLink></div></div></section>;
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
        <SectionHead tag={copy.services.tag[locale]} title={<>{h.services[locale]} <span>{h.servicesAccent[locale]}</span></>}>
          <TextLink href={local(locale, '/services')}>{h.allServices[locale]}</TextLink>
        </SectionHead>
        <ServiceGrid locale={locale} items={serviceItems} editorial />
        <ServiceChoices locale={locale} />
      </div>
    </section>
    <Transformations locale={locale} items={featured} />
    <Audience locale={locale}/>
    <section className="section projects-section">
      <div className="shell">
        <SectionHead tag={hasWork ? (locale === 'ar' ? 'المشاريع والتصورات' : 'Work and concepts') : copy.projects.tag[locale]} title={h.gallery[locale]} description={hasWork ? undefined : h.galleryCopy[locale]}>
          <TextLink href={local(locale, '/projects')}>{(hasWork ? h.viewProjects : h.allProjects)[locale]}</TextLink>
        </SectionHead>
        <ProjectGrid items={featured} locale={locale} />
      </div>
    </section>
    <Supplies locale={locale} />
    <GetStarted locale={locale} />
    <CTA locale={locale}/>
  </>;
}
export function Services({ locale, items = services }: { locale: Locale; items?: readonly SiteService[] }) {
  const c = copy.services;
  return (
    <>
      <PageIntro tag={c.tag[locale]} title={c.title[locale]} description={c.description[locale]} />
      <div className="section">
        <div className="shell service-overview">
          <ServiceChoices locale={locale} onOverview />
          {servicePaths.map(path => (
            <section key={path.id} id={path.id} className="service-group" tabIndex={-1}>
              <h2>{path.title[locale]}</h2>
              <p className="lead">{path.description[locale]}</p>
              <ServiceGrid locale={locale} items={items.filter(service => path.services.some(slug => slug === service.slug))} />
            </section>
          ))}
        </div>
      </div>
      <Audience locale={locale} />
      <CTA locale={locale} />
    </>
  );
}
export function ServiceDetail({ locale, item, serviceItems = services, projectItems = projects }: {
  locale: Locale; item: SiteService; serviceItems?: readonly SiteService[]; projectItems?: readonly Project[];
}) {
  const c = copy.services;
  const art = serviceArt[services.findIndex(service => service.slug === item.slug)];
  const image = item.art ?? { src: photo(art.image), alt: art.alt };
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
  const c=copy.projects;
  const hasWork = items.some(item => !item.sample);
  const tag = hasWork ? (locale === 'ar' ? 'معرض المشاريع' : 'Project gallery') : c.tag[locale];
  const description = hasWork ? (locale === 'ar' ? 'تصفّح أعمال تيرا والتصورات التوضيحية للحدائق.' : 'Browse completed TERRA work and illustrative garden concepts.') : c.description[locale];
  return <><PageIntro tag={tag} title={c.title[locale]} description={description}/><section className="section"><div className="shell"><h2 className="sr-only">{tag}</h2><p className="demo-note">{hasWork ? (locale === 'ar' ? 'الصور التي تحمل علامة «صور توضيحية» تعرض تصاميم تخيلية.' : 'Items labeled “Sample imagery” depict illustrative designs.') : c.disclaimer[locale]}</p><ProjectGrid items={items} locale={locale} filter/></div></section><CTA locale={locale}/></>;
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
          </aside>
          <div className="quote-panel">
            <h2>{whatsappCopy.form[locale]}</h2>
            <p className="demo-note quote-demo">{journey.formStatus[locale]}</p>
            <p className="lead">{journey.formGuide[locale]}</p>
            <QuoteForm locale={locale} serviceItems={serviceItems} />
          </div>
        </div>
      </section>
    </>
  );
}
export function Missing({locale}: {locale:Locale}) {
  return <><PageIntro tag="404" title={ui.notFound[locale]} description={ui.lost[locale]}/><div className="shell missing-action"><Link className="button primary" href={local(locale)}>{ui.backHome[locale]}</Link></div></>;
}
