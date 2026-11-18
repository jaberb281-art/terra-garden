'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { Check, ChevronDown, Globe2 } from 'lucide-react';
import { locales, type Locale } from '@/content/site';

const names = { en: 'English', ar: 'العربية' };

export function LanguageSelect({ locale, path }: { locale: Locale; path: string }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLUListElement>(null);
  const nextFocus = useRef<number | null>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    if (nextFocus.current !== null) {
      panel.current?.querySelectorAll('a')[nextFocus.current]?.focus();
      nextFocus.current = null;
    }
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [open]);

  function closeAndFocus() {
    setOpen(false);
    trigger.current?.focus();
  }

  return (
    <div
      className="language-select"
      ref={root}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={event => {
        if (open && event.key === 'Escape') {
          event.preventDefault();
          closeAndFocus();
        }
        if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
        if (!open && !['ArrowDown', 'ArrowUp'].includes(event.key)) return;
        event.preventDefault();
        if (!open) {
          nextFocus.current = event.key === 'ArrowUp' ? locales.length - 1 : 0;
          setOpen(true);
          return;
        }
        const links = Array.from(panel.current?.querySelectorAll('a') ?? []);
        const current = links.indexOf(document.activeElement as HTMLAnchorElement);
        const step = event.key === 'ArrowUp' ? -1 : 1;
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? links.length - 1 :
          current < 0 ? (step === 1 ? 0 : links.length - 1) : (current + step + links.length) % links.length;
        links[next]?.focus();
      }}
    >
      <button
        className="language"
        type="button"
        ref={trigger}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(value => !value)}
      >
        <Globe2 size={16} aria-hidden="true" />
        <span className="language-full">{names[locale]}</span>
        <span className="language-short">{locale === 'ar' ? 'ع' : 'EN'}</span>
        <span className="sr-only">{locale === 'ar' ? '، لغة الموقع' : ', site language'}</span>
        <ChevronDown size={13} aria-hidden="true" />
      </button>
      <ul ref={panel} id={id} className="language-panel" hidden={!open}>
        {locales.map(language => (
          <li key={language}>
            <Link
              href={'/' + language + path}
              hrefLang={language}
              aria-current={locale === language ? 'true' : undefined}
              onClick={closeAndFocus}
            >
              <span lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'}>{names[language]}</span>
              {locale === language && <Check size={16} aria-hidden="true" />}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
