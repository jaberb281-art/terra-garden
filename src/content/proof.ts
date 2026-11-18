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

/**
 * The short facts under the hero. "Hundreds of projects" comes from the owner;
 * confirm it, or replace it with an exact number, before launch.
 */
export const trustPoints = [
  { title: pair('Hundreds of projects', 'مئات المشاريع'), detail: pair('Completed across Qatar', 'أُنجزت في أنحاء قطر') },
  { title: pair('Free inspection', 'معاينة مجانية'), detail: pair('Before every quotation', 'قبل كل عرض سعر') },
  { title: pair('Quotes on WhatsApp', 'عروض الأسعار عبر واتساب'), detail: pair('Send photos of your garden', 'أرسل صوراً لحديقتك') },
  { title: pair('Villas to hotels', 'من الفلل إلى الفنادق'), detail: pair('Homes, offices, schools, hospitality', 'المنازل والمكاتب والمدارس والضيافة') },
] as const;