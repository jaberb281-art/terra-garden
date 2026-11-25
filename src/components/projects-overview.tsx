import Image from 'next/image';
import { ArrowDown, Leaf, PencilRuler, Sprout } from 'lucide-react';
import { pair, photo, type Locale } from '@/content/site';
import type { Project } from '@/content/catalog';
import { inquiryLink } from '@/content/whatsapp';
import { WhatsAppAction } from './whatsapp-action';
import { ProjectStories } from './project-stories';
import styles from './projects-overview.module.css';

const copy = {
  tag: pair('Projects & possibilities', 'مشاريع وإمكانيات'),
  conceptsTag: pair('The concept gallery', 'معرض التصورات'),
  title: pair('Ideas for a greener outdoors.', 'أفكار لمساحات أكثر خضرة.'),
  workTitle: pair('Outdoor spaces, thoughtfully transformed.', 'مساحات خارجية تتجدد بعناية.'),
  intro: pair('Explore garden concepts for a softer courtyard, a welcoming terrace or a greener path through the palms.', 'استكشف تصورات لفناء أكثر خضرة، أو شرفة ترحب بك، أو ممر أخضر بين أشجار النخيل.'),
  workIntro: pair('Explore completed work and illustrative concepts, from garden courtyards to outdoor living spaces.', 'استكشف أعمالنا المنجزة والتصورات التوضيحية، من أفنية الحدائق إلى مساحات المعيشة الخارجية.'),
  explore: pair('Explore the gallery', 'استكشف المعرض'),
  inquire: pair('Plan a similar space', 'خطّط لمساحة مشابهة'),
  approachTag: pair('Thoughtfully outdoors', 'مساحات مدروسة'),
  approachTitle: pair('Small details. A greener way to live.', 'تفاصيل صغيرة، وحياة أكثر خضرة.'),
  galleryTag: pair('Explore the possibilities', 'استكشف الإمكانيات'),
  galleryTitle: pair('A fresh perspective on your space.', 'نظرة جديدة إلى مساحتك.'),
  galleryWorkTitle: pair('Spaces, stories & transformations.', 'مساحات وقصص وتجدد.'),
};

const principles = [
  {
    icon: PencilRuler,
    title: pair('Start with the space', 'البداية من المساحة'),
    description: pair('A layout shaped around the way you move, gather and spend time outdoors.', 'توزيع يراعي طريقة حركتك واجتماعك بالآخرين وقضاء وقتك في الهواء الطلق.'),
  },
  {
    icon: Leaf,
    title: pair('Plant with purpose', 'زراعة لها غاية'),
    description: pair('Lawn, palms and planted edges that bring balance and softness to a garden.', 'عشب ونخيل وأحواض نباتات تضفي التوازن واللطف على الحديقة.'),
  },
  {
    icon: Sprout,
    title: pair('Think beyond day one', 'عناية تتجاوز اليوم الأول'),
    description: pair('Room for watering, seasonal attention and the care a growing garden needs.', 'مساحة للري والعناية الموسمية وكل ما تحتاجه الحديقة أثناء نموها.'),
  },
];

export function ProjectsOverview({ locale, items }: { locale: Locale; items: readonly Project[] }) {
  const hasWork = items.some(item => !item.sample);

  return <div className={styles.page}>
    <section className={styles.hero} aria-labelledby="projects-title">
      <Image
        src={photo('hero')}
        alt={locale === 'ar' ? 'حديقة منسقة مع أشجار نخيل وعشب أمام مبنى حجري' : 'Landscaped garden with palms and lawn in front of a stone building'}
        fill sizes="100vw" loading="eager" fetchPriority="high" className={styles.heroImage}
      />
      <div className={styles.heroShade} />
      <div className={'shell ' + styles.heroContent}>
        <p className={styles.kicker}>{(hasWork ? copy.tag : copy.conceptsTag)[locale]}</p>
        <h1 id="projects-title">{(hasWork ? copy.workTitle : copy.title)[locale]}</h1>
        <p className={styles.heroIntro}>{(hasWork ? copy.workIntro : copy.intro)[locale]}</p>
        <div className={styles.heroActions}>
          <a href="#project-gallery" className={'button ' + styles.explore}>{copy.explore[locale]}<ArrowDown size={17} aria-hidden="true" /></a>
          <WhatsAppAction locale={locale} href={inquiryLink(locale)} label={copy.inquire[locale]} className={'button ' + styles.inquire} />
        </div>
      </div>
    </section>

    <section className={'section ' + styles.approach} aria-labelledby="projects-approach">
      <div className="shell">
        <div className={styles.sectionHeading}><p className={styles.kicker}>{copy.approachTag[locale]}</p><h2 id="projects-approach">{copy.approachTitle[locale]}</h2></div>
        <ul className={styles.principles}>
          {principles.map(({ icon: Icon, title, description }) => <li key={title.en}>
            <Icon size={30} strokeWidth={1.45} aria-hidden="true" />
            <h3>{title[locale]}</h3><p>{description[locale]}</p>
          </li>)}
        </ul>
      </div>
    </section>

    <section className={'section ' + styles.gallery} id="project-gallery" aria-labelledby="project-gallery-title">
      <div className="shell">
        <div className={styles.sectionHeading}><p className={styles.kicker}>{copy.galleryTag[locale]}</p><h2 id="project-gallery-title">{(hasWork ? copy.galleryWorkTitle : copy.galleryTitle)[locale]}</h2></div>
        <ProjectStories locale={locale} items={items} />
      </div>
    </section>
  </div>;
}
