import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowRight, Check, ClipboardCheck, Leaf, CalendarDays } from 'lucide-react';
import { pair, photo, ui, type Locale } from '@/content/site';
import type { SiteService } from '@/content/catalog';
import { servicePaths } from '@/content/journey';
import { serviceDisplay, serviceUi } from '@/content/service-display';
import { faqs } from '@/content/faq';
import { inquiryLink } from '@/content/whatsapp';
import { WhatsAppAction } from './whatsapp-action';
import styles from './services-overview.module.css';

const text = {
  tag: pair('Our services', 'خدماتنا'),
  title: pair('Garden care, from the ground up.', 'العناية بحديقتك، من الجذور.'),
  intro: pair('Landscaping, regular maintenance, lawn care and irrigation for homes and businesses across Qatar.', 'تنسيق الحدائق وصيانتها والعناية بالعشب والري للمنازل والمنشآت في أنحاء قطر.'),
  explore: pair('Explore services', 'استكشف الخدمات'),
  inspection: pair('Request a free inspection', 'اطلب معاينة مجانية'),
  approach: pair('Rooted in care', 'عناية من الجذور'),
  approachTitle: pair('The right care for your outdoor space.', 'العناية المناسبة لمساحتك الخارجية.'),
  approachCopy: pair('From a garden that needs a little attention to a space ready for a fresh start. We begin by understanding what you have, and what you have in mind.', 'سواء كانت حديقتك تحتاج إلى بعض العناية أو كانت مساحتك جاهزة لبداية جديدة، نبدأ بفهم حالتها وما تتطلع إليه.'),
  directory: pair('Find your service', 'اختر خدمتك'),
  directoryTitle: pair('A greener space starts here.', 'مساحة أكثر خضرة تبدأ هنا.'),
  view: pair('View service', 'تفاصيل الخدمة'),
  process: pair('A simple start', 'بداية بسيطة'),
  processTitle: pair('From your first message to a garden cared for.', 'من رسالتك الأولى إلى حديقة تنعم بالعناية.'),
  questions: pair('Good to know', 'معلومات تهمك'),
  faqTitle: pair('A few things you might be wondering.', 'إجابات عن أسئلتك.'),
};
const benefits = [
  { icon: Leaf, title: pair('Care suited to your garden', 'عناية تناسب حديقتك'), copy: pair('Work shaped around its condition and your requirements.', 'أعمال تراعي حالة الحديقة واحتياجاتك.') },
  { icon: CalendarDays, title: pair('One visit or ongoing support', 'زيارة واحدة أو عناية مستمرة'), copy: pair('One-time, weekly and monthly care for homes and businesses.', 'عناية لمرة واحدة أو أسبوعية أو شهرية للمنازل والمنشآت.') },
  { icon: ClipboardCheck, title: pair('A clear starting point', 'بداية واضحة'), copy: pair('A free inspection, followed by a quotation for the agreed scope.', 'معاينة مجانية يتبعها عرض سعر للأعمال المتفق عليها.') },
];
const steps = [
  { title: pair('Tell us about your space', 'أخبرنا عن مساحتك'), copy: pair('Share your area in Qatar, what needs doing and a few photos if you have them.', 'شارك موقعك في قطر والأعمال المطلوبة وبعض الصور إن توفرت.') },
  { title: pair('Arrange a free inspection', 'رتّب معاينة مجانية'), copy: pair('We assess the garden and talk through the work with you.', 'نعاين الحديقة ونناقش معك الأعمال المطلوبة.') },
  { title: pair('Agree the work and quotation', 'اتفق على الأعمال وعرض السعر'), copy: pair('Review your quotation, then arrange the work and any ongoing care.', 'راجع عرض السعر، ثم رتّب موعد التنفيذ وأي عناية مستمرة.') },
];

export function ServicesOverview({ locale, items }: { locale: Locale; items: readonly SiteService[] }) {
  return <div className={styles.page}>
    <section className={styles.hero} aria-labelledby="services-title">
      <Image src={photo('service-landscape-design')} alt={serviceDisplay['landscape-design'].alt[locale]} fill sizes="100vw" fetchPriority="high" loading="eager" className={styles.heroImage} />
      <div className={styles.shade} />
      <div className={'shell ' + styles.heroContent}>
        <p className={styles.kicker}>{text.tag[locale]}</p>
        <h1 id="services-title">{text.title[locale]}</h1>
        <p className={styles.heroIntro}>{text.intro[locale]}</p>
        <div className={styles.heroActions}>
          <a href="#service-directory" className={'button ' + styles.explore}>{text.explore[locale]}<ArrowDown size={17} aria-hidden="true" /></a>
          <WhatsAppAction locale={locale} href={inquiryLink(locale)} label={text.inspection[locale]} className={'button ' + styles.inspection} />
        </div>
      </div>
    </section>

    <section className={'section ' + styles.approach} aria-labelledby="services-approach">
      <div className="shell">
        <div className={styles.sectionTitle}><p className={styles.kicker}>{text.approach[locale]}</p><h2 id="services-approach">{text.approachTitle[locale]}</h2></div>
        <div className={styles.approachGrid}>
          <div className={styles.approachIntro}><p className="lead">{text.approachCopy[locale]}</p></div>
          <figure className={styles.approachImage}><Image src={photo('service-grass-cutting')} alt={serviceDisplay['grass-cutting'].alt[locale]} fill sizes="(max-width: 760px) 92vw, 48vw" /><figcaption className="photo-tag">{ui.sample[locale]}</figcaption></figure>
          <ul className={styles.benefits}>{benefits.map(({ icon: Icon, title, copy }) => <li key={title.en}><span className={styles.benefitIcon}><Icon size={21} strokeWidth={1.6} aria-hidden="true" /></span><div><h3>{title[locale]}</h3><p>{copy[locale]}</p></div></li>)}</ul>
        </div>
      </div>
    </section>

    <section className={'section ' + styles.directory} id="service-directory" aria-labelledby="directory-title">
      <div className="shell">
        <div className={styles.sectionTitle}><p className={styles.kicker}>{text.directory[locale]}</p><h2 id="directory-title">{text.directoryTitle[locale]}</h2></div>
        <nav className={styles.jumpLinks + ' mobile-fit-bar'} aria-label={text.directory[locale]}>{servicePaths.map(path => <a href={'#' + path.id} key={path.id}>{path.choice[locale]}<ArrowDown size={16} aria-hidden="true" /></a>)}</nav>
        {servicePaths.map((path, index) => {
          const group = items.filter(service => path.services.some(slug => slug === service.slug)).sort((a, b) => serviceDisplay[a.slug].order - serviceDisplay[b.slug].order);
          if (!group.length) return null;
          return <section key={path.id} id={path.id} className={styles.group} aria-labelledby={path.id + '-title'}>
            <div className={styles.groupHeading}><span aria-hidden="true">0{index + 1}</span><div><h3 id={path.id + '-title'}>{path.title[locale]}</h3><p>{path.description[locale]}</p></div></div>
            <div className={styles.serviceList}>{group.map(service => {
              const display = serviceDisplay[service.slug];
              const image = service.art ?? { src: photo(display.image), alt: display.alt };
              return <article key={service.slug} className={styles.serviceRow}>
                <div className={styles.serviceImage}><Image src={image.src} alt={image.alt[locale]} fill sizes="(max-width: 760px) 90vw, (max-width: 1200px) 34vw, 420px" style={display.focus ? { objectPosition: display.focus } : undefined} /></div>
                <div className={styles.serviceBody}>
                  <h4><Link href={'/' + locale + '/services/' + service.slug}>{service.title[locale]}</Link></h4>
                  <p>{service.summary[locale]}</p>
                  <ul className={styles.scope}>{service.scope.slice(0, 3).map(point => <li key={point.en}><Check size={15} aria-hidden="true" /><span>{point[locale]}</span></li>)}</ul>
                  <div className={styles.rowActions}><Link className={'button primary ' + styles.viewService} href={'/' + locale + '/services/' + service.slug}>{text.view[locale]}<ArrowRight className="direction" size={17} aria-hidden="true" /></Link><WhatsAppAction locale={locale} href={inquiryLink(locale, { kind: 'service', name: service.title[locale] })} label={serviceUi.quote[locale]} subject={service.title[locale]} className={styles.quote} /></div>
                </div>
              </article>;
            })}</div>
          </section>;
        })}
      </div>
    </section>

    <section className={'section ' + styles.process} aria-labelledby="services-process"><div className="shell"><div className={styles.sectionTitle}><p className={styles.kicker}>{text.process[locale]}</p><h2 id="services-process">{text.processTitle[locale]}</h2></div><ol className={styles.steps}>{steps.map((step, index) => <li key={step.title.en}><span className={styles.stepNumber}>0{index + 1}</span><h3>{step.title[locale]}</h3><p>{step.copy[locale]}</p></li>)}</ol></div></section>
    <section className={'section ' + styles.questions} aria-labelledby="services-questions"><div className={'shell ' + styles.faqGrid}><div><p className={styles.kicker}>{text.questions[locale]}</p><h2 id="services-questions">{text.faqTitle[locale]}</h2></div><div className={styles.faqList}>{[faqs[0], faqs[1], faqs[3], faqs[5]].map(([question, answer]) => <details key={question.en}><summary>{question[locale]}</summary><p>{answer[locale]}</p></details>)}</div></div></section>
  </div>;
}
