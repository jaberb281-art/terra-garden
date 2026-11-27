'use client';

import { useEffect } from 'react';
import { trackConversion, type ConversionEvent } from '@/lib/conversion-events';

const events = new Set<ConversionEvent>([
  'whatsapp_click', 'telephone_click', 'email_click', 'free_inspection_request',
  'service_quote_request', 'project_enquiry',
]);

export function ConversionEvents() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_CONVERSION_EVENTS_ENABLED !== 'true') return;
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const anchor = event.target.closest<HTMLAnchorElement>('a[href]');
      if (!anchor) return;
      const href = anchor.getAttribute('href') || '';
      const channelEvent = href.startsWith('https://wa.me/') ? 'whatsapp_click'
        : href.startsWith('tel:') ? 'telephone_click'
        : href.startsWith('mailto:') ? 'email_click' : undefined;
      if (!channelEvent) return;
      const requested = anchor.dataset.conversion as ConversionEvent | undefined;
      const context = anchor.closest('.site-header') ? 'navigation'
        : anchor.closest('.site-footer') ? 'footer'
        : anchor.closest('.hero') ? 'hero'
        : anchor.closest('.svc-card') ? 'service_card'
        : anchor.closest('.cta') ? 'consultation'
        : anchor.closest('.whatsapp-widget') ? 'floating_button' : 'page';
      trackConversion(channelEvent, context);
      if (requested && events.has(requested) && requested !== channelEvent) trackConversion(requested, context);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
  return null;
}
