'use client';

import { useEffect, useRef, useState } from 'react';

/** Counts from 0 to `value` once, when scrolled into view. Shows the final number straight away for reduced motion or without JS. */
export function CountUp({ value, locale, suffix = '' }: { value: number; locale: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);
  const format = (n: number) => new Intl.NumberFormat(locale === 'ar' ? 'ar-QA' : 'en-US').format(Math.round(n));

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;
    setShown(0);
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const duration = 1400;
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        setShown(value * (1 - Math.pow(1 - t, 3)));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    observer.observe(el);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [value]);

  return <span ref={ref}>{format(shown)}{suffix}</span>;
}
