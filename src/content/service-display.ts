import { Brush, Droplets, Flower2, PencilRuler, Scissors, Shovel, Shrub, Sprout, TreePalm, type LucideIcon } from 'lucide-react';
import { projects, type ServiceSlug } from './catalog';
import { pair, type Localized } from './site';
import { servicePaths } from './journey';

/**
 * Presentation settings for each service, keyed by slug. Adding a service to
 * catalog.ts makes TypeScript ask for an entry here, so no card can end up
 * with the wrong icon or image because the list order changed.
 *
 * The care / build grouping is not repeated here: it comes from servicePaths.
 */
type Display = {
  icon: LucideIcon;
  /** Position in the home grid (lower comes first). */
  order: number;
  /** Featured cards are larger and list what the service includes. */
  featured?: boolean;
  /** Photo used on the service detail page, and on cards once showServicePhotos is on. */
  image: string;
  alt: Localized;
  /** CSS object-position for the card photo, when the subject sits off-centre. */
  focus?: string;
};

/**
 * Demo photos are in use for now (public/images/service-*.webp). When the real
 * photos are ready, overwrite those files and update the alt text below. Set
 * this to false to go back to icon-only cards.
 */
export const showServicePhotos = true;

const nursery = pair('Potted plants and soil in a nursery', 'نباتات في أصص وتربة في مشتل');

const alts = {
  maintenance: pair('Modern villa with a green lawn, planting beds and palms', 'فيلا حديثة مع مسطح عشبي أخضر وأحواض نباتات ونخيل'),
  mowing: pair('Gardener mowing a lawn between date palms', 'بستاني يقص العشب بين أشجار النخيل'),
  design: pair('White villa garden with a lawn, stepping stones and a pool', 'حديقة فيلا بيضاء مع مسطح عشبي وممر حجري ومسبح'),
  lawn: pair('Green lawn with stepping stones, palms and a pool beside a white villa', 'مسطح عشبي أخضر مع ممر حجري ونخيل ومسبح بجوار فيلا بيضاء'),
  soil: pair('Garden bed with a pebble path and lush plants', 'حوض زراعي ومسار من الحصى ونباتات كثيفة'),
  path: pair('Stone-paved garden path between tropical plants', 'ممر حجري في حديقة بين نباتات استوائية'),
  indoor: pair('Courtyard with large tropical plants and a stepping-stone path', 'فناء بنباتات استوائية كبيرة وممر من الألواح الحجرية'),
};

export const serviceDisplay: Record<ServiceSlug, Display> = {
  'garden-maintenance': { icon: Shrub, order: 1, featured: true, image: 'service-garden-maintenance', alt: alts.maintenance },
  'grass-cutting': { icon: Scissors, order: 2, featured: true, image: 'service-grass-cutting', alt: alts.mowing, focus: '50% 30%' },
  'date-palm-tree-care': { icon: TreePalm, order: 3, featured: true, image: 'farm-after', alt: projects[2].afterAlt },
  'landscape-design': { icon: PencilRuler, order: 4, image: 'service-landscape-design', alt: alts.design },
  'irrigation-systems': { icon: Droplets, order: 5, image: 'nursery', alt: nursery },
  'grass-plantation': { icon: Sprout, order: 6, image: 'service-grass-plantation', alt: alts.lawn },
  'soil-fertilization': { icon: Shovel, order: 7, image: 'service-soil-fertilization', alt: alts.soil },
  'garden-cleaning': { icon: Brush, order: 8, image: 'service-garden-cleaning', alt: alts.path },
  'indoor-plants': { icon: Flower2, order: 9, image: 'service-indoor-plants', alt: alts.indoor },
};

/** Services offered as one-tap WhatsApp choices in the hero panel. */
export const heroServices = [
  'grass-cutting', 'garden-maintenance', 'date-palm-tree-care', 'landscape-design', 'irrigation-systems',
] as const satisfies readonly ServiceSlug[];

export const serviceUi = {
  needTitle: pair('What do you need?', 'ما الذي تحتاجه؟'),
  needNote: pair('Tap one and WhatsApp opens with your message ready.', 'اختر خدمة وسيفتح واتساب برسالة جاهزة.'),
  needOther: pair('Something else', 'خدمة أخرى'),
  filter: pair('Filter services', 'تصفية الخدمات'),
  all: pair('All services', 'كل الخدمات'),
  quote: pair('Get a quote', 'اطلب عرض سعر'),
};

/** Which care / build path a service belongs to (from servicePaths). */
export function serviceGroup(slug: ServiceSlug) {
  return servicePaths.find(path => (path.services as readonly string[]).includes(slug))?.id;
}

export const isFeatured = (slug: ServiceSlug) => Boolean(serviceDisplay[slug].featured);