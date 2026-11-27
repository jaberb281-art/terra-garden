'use client';

import { useId, useState } from 'react';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { categories, ui, type Locale } from '@/content/site';
import type { Project } from '@/content/catalog';
import { projectPhoto } from '@/content/project-media';
import { MediaImage } from './media-image';

const comparisonSizes = '(max-width: 1100px) 91vw, 1040px';

export function Comparison({
  project, locale, compact = false, eager = false,
}: { project: Project; locale: Locale; compact?: boolean; eager?: boolean }) {
  const [position, setPosition] = useState(50);
  const id = useId();
  const before = projectPhoto(project, 'before');
  const after = projectPhoto(project, 'after');
  const ar = locale === 'ar';
  const choices = [
    { value: 100, label: ui.before[locale] },
    { value: 50, label: ar ? 'مقارنة' : 'Compare' },
    { value: 0, label: ui.after[locale] },
  ];

  return (
    <figure className="comparison">
      <div className="compare-frame" dir="ltr" style={{ '--split': position + '%' } as CSSProperties}>
        <MediaImage src={after.src} alt={after.alt[locale]} fill sizes={comparisonSizes} loading={eager ? 'eager' : undefined} />
        <MediaImage className="before-image" src={before.src} alt={before.alt[locale]} fill sizes={comparisonSizes} loading={eager ? 'eager' : undefined} />
        {position > 0 && <span className="compare-label before" aria-hidden="true">{ui.before[locale]}</span>}
        {position < 100 && <span className="compare-label after" aria-hidden="true">{ui.after[locale]}</span>}
        <input
          aria-label={ui.compare[locale]}
          aria-describedby={id}
          type="range"
          min="0"
          max="100"
          value={position}
          aria-valuetext={ar ? `الصورة قبل التنسيق ظاهرة بنسبة ${position}٪` : `${position}% of the before image revealed`}
          onChange={event => setPosition(Number(event.target.value))}
        />
        <div className="compare-line" aria-hidden="true">
          <span><ChevronLeft size={13} /><ChevronRight size={13} /></span>
        </div>
      </div>
      <div className="compare-actions" role="group" aria-label={ar ? 'عرض صور المقارنة' : 'Comparison views'}>
        {choices.map(choice => (
          <button key={choice.value} type="button" aria-pressed={position === choice.value} onClick={() => setPosition(choice.value)}>
            {choice.label}
          </button>
        ))}
      </div>
      <figcaption id={id} className={compact ? 'sr-only' : undefined}>
        <span>{ui.drag[locale]}</span>
        {locale === 'ar'
          ? <span className="sr-only"> يمكنك أيضاً استخدام مفاتيح الأسهم للمقارنة.</span>
          : <span className="sr-only"> You can also use the arrow keys to compare.</span>}
        {!compact && project.sample && <span>{ui.demo[locale]}</span>}
      </figcaption>
    </figure>
  );
}

export function Featured({ items, locale }: { items: readonly Project[]; locale: Locale }) {
  const [index, setIndex] = useState(0);
  const [announcement, setAnnouncement] = useState('');

  const ar = locale === 'ar';
  const item = items[index] ?? items[0];
  if (!item) return null;
  const category = categories.find(entry => entry.id === item.category);
  const projectLink = item.sample ? ui.view[locale] : ar ? 'عرض المشروع' : 'View project';

  return (
    <div
      className="featured"
      role="region"
      aria-label={ar ? 'مقارنة تصاميم الحدائق قبل وبعد' : 'Before and after garden concepts'}
    >
      <div className="showcase-nav">
        <div className="showcase-selectors mobile-fit-bar" role="group" aria-label={ar ? 'اختر تصوراً للمقارنة' : 'Choose a project to compare'}>
          {items.map((project, position) => (
            <button
              type="button"
              key={project.slug}
              aria-pressed={position === index}
              onClick={() => {
                setIndex(position);
                setAnnouncement(project.title[locale]);
              }}
            >
              {project.title[locale]}
            </button>
          ))}
        </div>
      </div>
      <div className="showcase-stage">
        <div className="showcase-image" key={item.slug}>
          <Comparison project={item} locale={locale} compact eager={index !== 0} />
        </div>
      </div>
      <div className="showcase-meta">
        <div className="showcase-project">
          <h3>{item.title[locale]}</h3>
          <p>{category?.title[locale]}{item.sample && <> <span aria-hidden="true">·</span> {ui.sample[locale]}</>}</p>
        </div>
        <Link
          className="showcase-link"
          href={'/' + locale + '/projects/' + item.slug}
          aria-label={projectLink + ' · ' + item.title[locale]}
        >
          {projectLink} <ArrowRight className="direction" size={16} aria-hidden="true" />
        </Link>
      </div>
      <span className="sr-only" role="status">{announcement}</span>
    </div>
  );
}
