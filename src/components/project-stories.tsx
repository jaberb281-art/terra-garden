'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { categories, copy, pair, ui, type Locale } from '@/content/site';
import type { Project } from '@/content/catalog';
import { projectPhoto } from '@/content/project-media';
import { MediaImage } from './media-image';
import styles from './projects-overview.module.css';

const text = {
  filters: pair('Filter the gallery by property type', 'تصفية المعرض حسب نوع العقار'),
  all: pair('All concepts', 'كل التصورات'),
  allWork: pair('All work & concepts', 'كل الأعمال والتصورات'),
  mixedNote: pair('Items labeled “Sample imagery” are illustrative designs, rather than completed client projects.', 'العناصر التي تحمل علامة «صور توضيحية» هي تصاميم تخيلية وليست مشاريع منفذة للعملاء.'),
  empty: pair('No projects or concepts in this category yet.', 'لا توجد مشاريع أو تصورات في هذه الفئة بعد.'),
  viewConcept: pair('View concept', 'شاهد التصور'),
  viewProject: pair('View project', 'شاهد المشروع'),
  results: pair('Results shown', 'عدد النتائج'),
  galleryEmpty: pair('New garden stories are on their way. Contact us to talk about your space.', 'قصص جديدة للحدائق قادمة. تواصل معنا لنتحدث عن مساحتك.'),
};

export function ProjectStories({ locale, items }: { locale: Locale; items: readonly Project[] }) {
  const [category, setCategory] = useState('all');
  const hasWork = items.some(item => !item.sample);
  const shown = items.map((project, index) => ({ project, number: String(index + 1).padStart(2, '0') }))
    .filter(({ project }) => category === 'all' || project.category === category);
  const allLabel = (hasWork ? text.allWork : text.all)[locale];

  return <>
    <p className={styles.provenance}>{(hasWork ? text.mixedNote : copy.projects.disclaimer)[locale]}</p>
    <div className={styles.filters + ' mobile-fit-bar'} role="group" aria-label={text.filters[locale]}>
      <button type="button" aria-pressed={category === 'all'} onClick={() => setCategory('all')}>{allLabel}</button>
      {categories.map(item => <button key={item.id} type="button" aria-pressed={category === item.id} onClick={() => setCategory(item.id)}>{item.name[locale]}</button>)}
    </div>
    <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{text.results[locale]}: {shown.length}</p>
    {shown.length ? <div className={styles.stories}>
      {shown.map(({ project, number }) => {
        const property = categories.find(item => item.id === project.category);
        const href = '/' + locale + '/projects/' + project.slug;
        const label = (project.sample ? text.viewConcept : text.viewProject)[locale];

        return <article className={styles.story} key={project.slug} aria-labelledby={'story-' + project.slug}>
          <span className={styles.number} aria-hidden="true" dir="ltr">{number}</span>
          <div className={styles.storyContent}>
            <div className={styles.storyHeading}>
              <div><p className={styles.property}>{property?.name[locale]}</p><h3 id={'story-' + project.slug}><Link href={href}>{project.title[locale]}</Link></h3></div>
              {project.sample && <span className={styles.sample}>{ui.sample[locale]}</span>}
            </div>
            <div className={styles.imagePair}>
              {(['before', 'after'] as const).map(stage => {
                const image = projectPhoto(project, stage);
                return <figure className={styles.projectImage} key={stage}>
                  <MediaImage src={image.src} alt={image.alt[locale]} fill sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1440px) 43vw, 610px" />
                  <figcaption>{ui[stage][locale]}</figcaption>
                </figure>;
              })}
            </div>
            <div className={styles.storyFooter}>
              <div><p className={styles.summary}>{project.summary[locale]}</p>{project.location?.[locale] && <p className={styles.location}>{project.location[locale]}</p>}</div>
              <Link href={href} className={'button primary ' + styles.view} aria-label={label + ' · ' + project.title[locale]}>{label}<ArrowRight className="direction" size={17} aria-hidden="true" /></Link>
            </div>
          </div>
        </article>;
      })}
    </div> : <div className={styles.empty}>
      <p>{(items.length ? text.empty : text.galleryEmpty)[locale]}</p>
      {category !== 'all' && <button type="button" className="button primary" onClick={() => setCategory('all')}>{allLabel}</button>}
    </div>}
  </>;
}
