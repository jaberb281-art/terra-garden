import { whatsappCopy } from '@/content/whatsapp';
import type { Locale } from '@/content/site';
import { WhatsAppIcon } from './whatsapp-icon';
import type { ConversionEvent } from '@/lib/conversion-events';

export function WhatsAppAction({
  locale, href, label, className, subject, conversion,
}: {
  locale: Locale;
  href?: string;
  label: string;
  className: string;
  subject?: string;
  conversion?: ConversionEvent;
}) {
  if (!href) {
    return (
      <button type="button" disabled className={className} title={whatsappCopy.unavailableDetail[locale]}>
        <WhatsAppIcon />
        <span>{whatsappCopy.unavailable[locale]}</span>
      </button>
    );
  }
  return (
    <a href={href} className={className} data-conversion={conversion || (subject ? 'service_quote_request' : undefined)} aria-label={subject ? label + ' · ' + subject : undefined}>
      <WhatsAppIcon />
      <span>{label}</span>
    </a>
  );
}
