'use client';

import { useEffect } from 'react';

// Elements that fade up as they scroll into view. Siblings inside the same
// grid/list get a small stagger delay so cards arrive one after another.
const REVEAL = [
  '.section-head',
  '.page-intro .shell > div',
  '.services-grid > *',
  '.audience-card',
  '.project-grid > *',
  '.project-card',
  '.card-grid > *',
  '.split-image',
  '.split > div:not(.split-image)',
  '.product-list > *',
  '.faq details',
  '.cta-content',
  '.transformations .shell > *',
].join(',');

/**
 * Adds scroll-reveal and a shrinking header. Purely progressive: nothing is
 * hidden until this runs, and nothing is hidden at all when the visitor
 * prefers reduced motion. Attributes are set on the DOM directly (data-*),
 * so React never fights over them.
 */
export function Motion() {
  useEffect(() => {
    const root = document.documentElement;
    const header = document.querySelector<HTMLElement>('.site-header');
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        header?.toggleAttribute('data-scrolled', window.scrollY > 24);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let observer: IntersectionObserver | undefined;
    if (!reduce.matches && 'IntersectionObserver' in window) {
      const seen = new Set<Element>();
      observer = new IntersectionObserver(
        entries => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            (entry.target as HTMLElement).dataset.reveal = 'in';
            observer?.unobserve(entry.target);
          }
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
      );
      document.querySelectorAll<HTMLElement>(REVEAL).forEach(el => {
        if (seen.has(el)) return;
        seen.add(el);
        // Anything already on screen stays put, so there is no flash on load.
        if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;
        const index = el.parentElement ? Array.from(el.parentElement.children).indexOf(el) : 0;
        el.style.setProperty('--i', String(Math.min(index, 5)));
        el.dataset.reveal = 'wait';
        observer?.observe(el);
      });
      root.dataset.motion = 'on';
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
      observer?.disconnect();
      delete root.dataset.motion;
    };
  }, []);

  return null;
}
