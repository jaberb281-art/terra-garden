'use client';

import { useEffect } from 'react';

/** Update the compact header without measuring or animating offscreen content. */
export function Motion() {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>('.site-header');
    if (!header) return;
    let frame = 0;
    let scrolled = header.hasAttribute('data-scrolled');
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const next = window.scrollY > 24;
        if (next === scrolled) return;
        scrolled = next;
        header.toggleAttribute('data-scrolled', next);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
