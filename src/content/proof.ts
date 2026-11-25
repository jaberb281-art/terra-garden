import { pair, type Localized } from './site';

/**
 * Real proof only. The "Proof" section on the home page renders nothing until
 * you add entries here, so no invented numbers or reviews ever ship.
 *
 * Stat:  { value: 250, suffix: '+', label: pair('Lawns maintained', '...') }
 * Quote: { quote: pair('...', '...'), name: 'Client name', place: pair('Al Waab, Doha', '...') }
 * Only add reviews you have written permission to publish.
 */
export type Stat = { value: number; suffix?: string; label: Localized };
export type Testimonial = { quote: Localized; name: string; place?: Localized };

export const stats: readonly Stat[] = [];
export const testimonials: readonly Testimonial[] = [];

export const proofCopy = {
  tag: pair('Trusted care', 'عناية موثوقة'),
  title: pair('What our clients say', 'ماذا يقول عملاؤنا'),
};

/** Introductory highlights under the hero. Replace each image here when ready. */
export const trustPoints = [
  {
    title: pair('Free garden inspection', 'معاينة مجانية لحديقتك'),
    detail: pair('A clear starting point for your quotation.', 'بداية واضحة لإعداد عرض السعر.'),
    image: 'service-soil-fertilization',
    alt: pair('Garden planting bed with a pebble path', 'حوض نباتات في حديقة مع ممر من الحصى'),
  },
  {
    title: pair('Regular garden care', 'عناية دورية بالحديقة'),
    detail: pair('One-time, weekly or monthly visits.', 'زيارات لمرة واحدة أو أسبوعية أو شهرية.'),
    image: 'service-grass-cutting',
    alt: pair('Gardener mowing a lawn between date palms', 'بستاني يقص العشب بين أشجار النخيل'),
  },
  {
    title: pair('Homes & businesses', 'للمنازل والمنشآت'),
    detail: pair('Gardening and landscaping across Qatar.', 'بستنة وتنسيق حدائق في أنحاء قطر.'),
    image: 'villa-after',
    alt: pair('Green lawn and planting in a villa garden', 'عشب أخضر ونباتات في حديقة فيلا'),
  },
] as const;
