export type ConversionEvent =
  | 'whatsapp_click'
  | 'telephone_click'
  | 'email_click'
  | 'free_inspection_request'
  | 'service_quote_request'
  | 'project_enquiry';

/** Optional adapter: no provider script, identifiers, message text or form data. */
export function trackConversion(event: ConversionEvent, context: string) {
  if (process.env.NEXT_PUBLIC_CONVERSION_EVENTS_ENABLED !== 'true' || typeof window === 'undefined') return;
  const detail = {
    event,
    channel: event === 'telephone_click' ? 'telephone' : event === 'email_click' ? 'email' : 'whatsapp',
    context,
    locale: document.documentElement.lang,
    path: window.location.pathname,
  };
  window.dispatchEvent(new CustomEvent('abgardening:conversion', { detail }));
}
