'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { X } from 'lucide-react';
import { WhatsAppIcon } from './whatsapp-icon';

const storageKey = 'terra:whatsapp-intro';
const stepEvent = 'terra:whatsapp-step';
const motionQuery = '(prefers-reduced-motion: reduce)';
const interactive = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex="0"], dialog[open]';
let sessionStep = 0;

function readStep() {
  try { return Number(sessionStorage.getItem(storageKey)) || sessionStep; }
  catch { return sessionStep; }
}

function saveStep(step: number) {
  sessionStep = step;
  try { sessionStorage.setItem(storageKey, String(step)); }
  catch { /* The in-memory step also covers client navigation. */ }
  window.dispatchEvent(new Event(stepEvent));
}

function subscribeToStep(update: () => void) {
  window.addEventListener(stepEvent, update);
  return () => window.removeEventListener(stepEvent, update);
}

function subscribeToMotion(update: () => void) {
  const media = window.matchMedia(motionQuery);
  media.addEventListener('change', update);
  return () => media.removeEventListener('change', update);
}

function subscribeToVisibility(update: () => void) {
  document.addEventListener('visibilitychange', update);
  return () => document.removeEventListener('visibilitychange', update);
}

function overlaps(first: DOMRect, second: DOMRect) {
  return first.left < second.right && first.right > second.left &&
    first.top < second.bottom && first.bottom > second.top;
}

export function WhatsAppWidget({
  href, label, unavailable, dismiss, reminders, route,
}: {
  href?: string;
  label: string;
  unavailable: string;
  dismiss: string;
  reminders: readonly string[];
  route: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const reminder = useRef<HTMLDivElement>(null);
  const link = useRef<HTMLAnchorElement>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [blocked, setBlocked] = useState({ button: false, reminder: false });
  const step = useSyncExternalStore(subscribeToStep, readStep, () => 0);
  const reducedMotion = useSyncExternalStore(subscribeToMotion, () => window.matchMedia(motionQuery).matches, () => true);
  const pageHidden = useSyncExternalStore(subscribeToVisibility, () => document.hidden, () => true);
  const showReminder = Boolean(href) && !reducedMotion && step < reminders.length;

  useEffect(() => {
    const widget = root.current;
    if (!widget) return;
    let frame = 0;
    const check = () => {
      const buttonRect = widget.getBoundingClientRect();
      const reminderRect = reminder.current?.getBoundingClientRect();
      let buttonBlocked = false;
      let reminderBlocked = false;

      // Preserve access to page controls when they scroll under the fixed widget.
      for (const control of document.querySelectorAll(interactive)) {
        if (widget.contains(control) || control.closest('details:not([open]) :not(summary), [hidden], [inert]')) continue;
        const rect = control.getBoundingClientRect();
        if (!rect.width || !rect.height) continue;
        buttonBlocked ||= overlaps(buttonRect, rect);
        reminderBlocked ||= Boolean(reminderRect && overlaps(reminderRect, rect));
        if (buttonBlocked && (reminderBlocked || !reminderRect)) break;
      }

      setBlocked(previous => previous.button === buttonBlocked && previous.reminder === reminderBlocked
        ? previous : { button: buttonBlocked, reminder: reminderBlocked });
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(check);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    if (reminder.current) observer.observe(reminder.current);
    const events = ['scroll', 'resize', 'focusin', 'click', 'toggle'] as const;
    for (const event of events) window.addEventListener(event, schedule, { capture: true, passive: true });
    window.visualViewport?.addEventListener('resize', schedule);
    schedule();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      for (const event of events) window.removeEventListener(event, schedule, true);
      window.visualViewport?.removeEventListener('resize', schedule);
    };
  }, [route, showReminder]);

  useEffect(() => {
    if (!showReminder || blocked.button || blocked.reminder || hovered || focused || pageHidden) return;
    const timer = window.setTimeout(() => saveStep(step + 1), 3000);
    return () => window.clearTimeout(timer);
  }, [showReminder, blocked.button, blocked.reminder, hovered, focused, pageHidden, step]);

  return (
    <div
      ref={root}
      className="whatsapp-widget"
      data-blocked={blocked.button && !focused}
      onPointerEnter={event => { if (event.pointerType !== 'touch') setHovered(true); }}
      onPointerLeave={event => { if (event.pointerType !== 'touch') setHovered(false); }}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
    >
      {showReminder && (
        <div ref={reminder} className="whatsapp-reminder" data-blocked={blocked.reminder && !focused}>
          <span key={step}>{reminders[step]}</span>
          <button type="button" aria-label={dismiss} onClick={() => {
            link.current?.focus({ preventScroll: true });
            saveStep(reminders.length);
          }}>
            <X size={15} aria-hidden="true" />
          </button>
        </div>
      )}
      {href ? (
        <a className="whatsapp-fab" ref={link} href={href} aria-label={label}>
          <WhatsAppIcon size={25} />
        </a>
      ) : (
        <button className="whatsapp-fab" type="button" disabled aria-label={unavailable} title={unavailable}>
          <WhatsAppIcon size={25} />
        </button>
      )}
    </div>
  );
}
