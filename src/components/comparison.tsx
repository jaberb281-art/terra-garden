'use client';

import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { categories, ui, type Locale } from '@/content/site';
import type { Project } from '@/content/catalog';
import { projectPhoto } from '@/content/project-media';
import { MediaImage } from './media-image';

const motionQuery = '(prefers-reduced-motion: reduce)';
const ROTATION_MS = 3000;
const comparisonSizes = '(max-width: 1100px) 91vw, 1040px';

function subscribeToMotion(update: () => void) {
  const media = window.matchMedia(motionQuery);
  media.addEventListener('change', update);
  return () => media.removeEventListener('change', update);
}

export function Comparison({
  project, locale, compact = false, eager = false,
}: { project: Project; locale: Locale; compact?: boolean; eager?: boolean }) {
  const frame = useRef<HTMLDivElement>(null);
  const id = useId();
  const before = projectPhoto(project, 'before');
  const after = projectPhoto(project, 'after');

  return (
    <figure className="comparison">
      <div ref={frame} className="compare-frame" dir="ltr">
        <MediaImage src={after.src} alt={after.alt[locale]} fill sizes={comparisonSizes} loading={eager ? 'eager' : undefined} />
        <MediaImage className="before-image" src={before.src} alt={before.alt[locale]} fill sizes={comparisonSizes} loading={eager ? 'eager' : undefined} />
        <span className="compare-label before" aria-hidden="true">{ui.before[locale]}</span>
        <span className="compare-label after" aria-hidden="true">{ui.after[locale]}</span>
        <input
          aria-label={ui.compare[locale]}
          aria-describedby={id}
          type="range"
          min="0"
          max="100"
          defaultValue="50"
          onChange={event => frame.current?.style.setProperty('--split', event.target.value + '%')}
        />
        <div className="compare-line" aria-hidden="true">
          <span><ChevronLeft size={13} /><ChevronRight size={13} /></span>
        </div>
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
  const region = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Set<number>());
  const hoverRef = useRef(false);
  const [index, setIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const reducedMotion = useSyncExternalStore(
    subscribeToMotion,
    () => window.matchMedia(motionQuery).matches,
    () => true,
  );

  const ar = locale === 'ar';
  const item = items[index];
  const category = categories.find(entry => entry.id === item.category);
  const projectLink = ar ? 'عرض المشروع' : 'View Project';
  const rotating = visible && !paused && !hovering && !focused && !interacting && !reducedMotion;

  useEffect(() => {
    const image = stage.current;
    if (!image) return;
    let inView = false;
    const update = () => setVisible(inView && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.intersectionRatio >= 0.25;
      update();
    }, { threshold: 0.25 });
    observer.observe(image);
    document.addEventListener('visibilitychange', update);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', update);
    };
  }, []);

  useEffect(() => {
    const active = pointers.current;
    const release = (event: PointerEvent) => {
      if (active.delete(event.pointerId) && !active.size) setInteracting(false);
    };
    const clear = () => {
      active.clear();
      setInteracting(false);
    };
    window.addEventListener('pointerup', release, true);
    window.addEventListener('pointercancel', release, true);
    window.addEventListener('blur', clear);
    return () => {
      window.removeEventListener('pointerup', release, true);
      window.removeEventListener('pointercancel', release, true);
      window.removeEventListener('blur', clear);
      active.clear();
    };
  }, []);

  useEffect(() => {
    if (!rotating || items.length < 2) return;
    const timer = window.setTimeout(() => {
      if (pointers.current.size || hoverRef.current || region.current?.contains(document.activeElement)) return;
      setAnnouncement('');
      setIndex(current => (current + 1) % items.length);
    }, ROTATION_MS);
    return () => window.clearTimeout(timer);
  }, [rotating, index, items.length]);

  function updateHover(value: boolean) {
    hoverRef.current = value;
    setHovering(value);
  }

  return (
    <div
      className="featured"
      role="region"
      aria-label={ar ? 'مقارنة تصاميم الحدائق قبل وبعد' : 'Before and after garden concepts'}
      ref={region}
      onPointerEnter={event => { if (event.pointerType !== 'touch') updateHover(true); }}
      onPointerLeave={event => { if (event.pointerType !== 'touch') updateHover(false); }}
      onPointerDownCapture={event => {
        pointers.current.add(event.pointerId);
        setInteracting(true);
      }}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
    >
      <div className="showcase-nav">
        {!reducedMotion && items.length > 1 && (
          <button type="button" className="showcase-autoplay sr-only focus:not-sr-only" onClick={() => setPaused(value => !value)}>
            {paused
              ? (ar ? 'استئناف التبديل التلقائي' : 'Resume automatic rotation')
              : (ar ? 'إيقاف التبديل التلقائي' : 'Pause automatic rotation')}
          </button>
        )}
        <div className="showcase-selectors" role="group" aria-label={ar ? 'اختر تصوراً للمقارنة' : 'Choose a project to compare'}>
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
      <div className="showcase-stage" ref={stage}>
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
