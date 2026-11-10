import { whatsappCopy } from '@/content/whatsapp';
import type { Locale } from '@/content/site';
import { WhatsAppIcon } from './whatsapp-icon';

export function WhatsAppAction({
  locale, href, label, className, subject,
}: {
  locale: Locale;
  href?: string;
  label: string;
  className: string;
  subject?: string;
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
    <a href={href} className={className} aria-label={subject ? label + ' · ' + subject : undefined}>
      <WhatsAppIcon />
      <span>{label}</span>
    </a>
  );
}
