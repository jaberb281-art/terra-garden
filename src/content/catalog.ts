import { pair, type Localized } from './site';

export interface Service {
  slug: string;
  title: Localized;
  summary: Localized;
  detail: Localized;
  scope: readonly Localized[];
  faq: readonly [Localized, Localized];
}
export const services = [
  {
    slug: 'grass-cutting', title: pair('Grass cutting', 'قص العشب'),
    summary: pair('Mowing, edging and upkeep for an existing lawn.', 'قص العشب وتشذيب الحواف والعناية بالمسطح العشبي القائم.'),
    detail: pair('A clean cut starts with checking the grass type, its growth and how the area is used. Cutting height and timing can then be adjusted as heat and growth change through the season.', 'يبدأ القص الجيد بتحديد نوع العشب ومعدل نموه وطريقة استخدام المساحة، ثم تُضبط مواعيد القص وارتفاعه مع تغيّر الحرارة والنمو خلال الموسم.'),
    scope: [pair('Mow to a height suited to the turf.', 'قص العشب بارتفاع يناسب نوعه.'), pair('Trim edges around paths and planting beds.', 'تشذيب الحواف حول الممرات وأحواض الزراعة.'), pair('Clear clippings from adjacent paving.', 'إزالة بقايا القص عن الأرضيات المجاورة.')],
    faq: [pair('Can the mowing schedule change by season?', 'هل يتغير جدول القص حسب الموسم؟'), pair('Yes. Frequency can be adjusted to actual growth, turf condition and watering.', 'نعم، يمكن ضبط وتيرة القص وفقاً لمعدل النمو وحالة العشب والري.')],
  },
  {
    slug: 'garden-maintenance', title: pair('Garden maintenance', 'صيانة الحدائق'),
    summary: pair('Pruning, tidying and seasonal care for beds, shrubs and planted areas.', 'تقليم وترتيب وعناية موسمية بالأحواض والشجيرات والمساحات المزروعة.'),
    detail: pair('Regular visits make it easier to spot wilting, blocked emitters and overgrown beds before small issues spread. The work can focus on high-use areas or cover the full garden.', 'تساعد الزيارات الدورية على رصد الذبول وانسداد النقاطات وفرط نمو النباتات قبل تفاقم المشكلات. ويمكن تركيز العمل على أكثر المساحات استخداماً أو تغطية الحديقة كاملة.'),
    scope: [pair('Light pruning and removal of dry growth.', 'تقليم خفيف وإزالة الأجزاء الجافة.'), pair('Weed beds and clear fallen leaves.', 'إزالة الأعشاب الدخيلة والأوراق المتساقطة.'), pair('Flag visible signs of plant stress and irrigation issues.', 'رصد علامات إجهاد النباتات ومشكلات الري الظاهرة.')],
    faq: [pair('What if I only need a one-off tidy-up?', 'ماذا لو احتجت إلى ترتيب الحديقة مرة واحدة فقط؟'), pair('Describe which areas need attention and mention any preferred date. Confirm the scope and visit options directly with TERRA when an inquiry channel is available.', 'حدّد المساحات التي تحتاج إلى العناية وأي موعد تفضّله. وعندما تتاح وسيلة للتواصل، أكّد نطاق العمل وخيارات الزيارة مع تيرا.')],
  },
  {
    slug: 'landscaping', title: pair('Landscaping', 'تنسيق المساحات الخارجية'),
    summary: pair('Improve how an outdoor space looks and works through layout and planting.', 'تحسين شكل المساحة الخارجية وطريقة استخدامها من خلال التخطيط والزراعة.'),
    detail: pair('A layout starts with the routes people actually take and the places they want to spend time. Shade, screening and planting can then work together around those uses.', 'يبدأ التخطيط بمسارات الحركة الفعلية والأماكن التي يفضّل الناس قضاء الوقت فيها. ثم يُنسّق الظل والحجب والزراعة بما يلائم هذه الاستخدامات.'),
    scope: [pair('Review access, existing plants and shade.', 'مراجعة المداخل والنباتات القائمة ومناطق الظل.'), pair('Plan paths, seating zones and planting beds.', 'تخطيط الممرات والجلسات وأحواض الزراعة.'), pair('Identify materials and planting suited to site conditions.', 'اختيار المواد والنباتات الملائمة لظروف الموقع.')],
    faq: [pair('Can existing trees be part of the plan?', 'هل يمكن دمج الأشجار القائمة في التصميم؟'), pair('Yes. Established trees can provide structure and shade; their health and root space should guide the layout.', 'نعم، فالأشجار القائمة تمنح المكان بنية وظلاً. ويُراعى وضعها الصحي ومساحة جذورها عند التخطيط.')],
  },
  {
    slug: 'plant-and-irrigation', title: pair('Planting & irrigation', 'الزراعة والري'),
    summary: pair('Plant selection, planting arrangements and watering suited to the site.', 'اختيار النباتات وتوزيعها وتحديد أساليب الري الملائمة للموقع.'),
    detail: pair('Sun exposure, drainage and water needs shape planting choices. Grouping plants with similar water needs can simplify irrigation and make adjustments easier across seasons.', 'تؤثر أشعة الشمس وتصريف التربة واحتياجات المياه في اختيار النباتات. ويساعد تجميع النباتات ذات الاحتياجات المتقاربة على تبسيط الري وتعديله بين المواسم.'),
    scope: [pair('Review sun, exposure and soil drainage.', 'مراجعة التعرض للشمس والرياح وتصريف التربة.'), pair('Choose planting suited to each area.', 'اختيار نباتات مناسبة لكل منطقة.'), pair('Review emitter placement and watering zones.', 'مراجعة مواقع النقاطات وتقسيم مناطق الري.')],
    faq: [pair('Can you work with an existing watering system?', 'هل يمكن استخدام نظام الري الحالي؟'), pair('Include the system type and any dry or wet spots in your inquiry so the scope can include a review.', 'اذكر نوع النظام وأي بقع جافة أو شديدة الرطوبة حتى تُدرج مراجعته ضمن نطاق العمل.')],
  },
] as const satisfies readonly Service[];

export type ServiceSlug = typeof services[number]['slug'];
export interface Project {
  slug: string;
  category: 'villas' | 'commercial' | 'farms';
  title: Localized;
  summary: Localized;
  story: { challenge: Localized; approach: Localized; outcome: Localized };
  image: string;
  beforeAlt: Localized;
  afterAlt: Localized;
  services: readonly ServiceSlug[];
  sample: boolean;
}
export const projects: readonly Project[] = [
  { slug: 'villa-garden-makeover', category: 'villas', title: pair('Villa garden makeover', 'تجديد حديقة فيلا'),
    summary: pair('From an open patch of earth to a softer garden courtyard.', 'من أرض مكشوفة إلى فناء حديقة أكثر حيوية.'),
    story: {
      challenge: pair('An exposed courtyard with bare ground and little definition around its edges.', 'فناء مكشوف بأرض عارية وحواف غير محددة.'),
      approach: pair('Keep the palm and boundary walls, then use a central lawn and planted edges with room for a watering line.', 'الإبقاء على النخلة والجدران المحيطة، مع تخصيص مسطح عشبي في الوسط وأطراف مزروعة تتيح تمديد خط للري.'),
      outcome: pair('An open area for play with a softer transition between the garden and villa.', 'مساحة مفتوحة للعب وانتقال أكثر سلاسة بين الحديقة والفيلا.'),
    },
    image: 'villa', beforeAlt: pair('Villa courtyard with bare soil', 'فناء فيلا بتربة مكشوفة'), afterAlt: pair('Same courtyard with lawn and planted edges', 'الفناء نفسه بعد إضافة العشب والنباتات الطرفية'),
    services: ['landscaping', 'grass-cutting', 'plant-and-irrigation'], sample: true },
  { slug: 'outdoor-living-renewal', category: 'commercial', title: pair('Outdoor living renewal', 'تجديد جلسة خارجية'),
    summary: pair('A paved terrace reimagined as a place to pause.', 'تخيّل شرفة مرصوفة تتحول إلى مكان للاستراحة.'),
    story: {
      challenge: pair('An empty paved terrace with shade but no defined place to sit.', 'شرفة مرصوفة وفارغة تتوفر فيها الظلال دون مكان محدد للجلوس.'),
      approach: pair('Use the existing pergola to define a seating area, plant around the edge, and keep the paved route clear.', 'استخدام المظلة القائمة لتحديد منطقة جلوس، وإضافة نباتات عند الحواف، وإبقاء المسار المرصوف مفتوحاً.'),
      outcome: pair('A sheltered place to pause with planting that leaves room for everyday movement.', 'مكان مظلل للاستراحة تحيط به نباتات تترك مساحة للحركة اليومية.'),
    },
    image: 'patio', beforeAlt: pair('Bare paved terrace under a pergola', 'شرفة مرصوفة فارغة تحت مظلة'), afterAlt: pair('Same terrace with seating and ornamental grasses', 'الشرفة نفسها مع مقاعد وأعشاب للزينة'),
    services: ['landscaping', 'garden-maintenance'], sample: true },
  { slug: 'farm-landscape-care', category: 'farms', title: pair('Farm landscape care', 'العناية بمساحات المزرعة'),
    summary: pair('Tidy beds and clearer circulation among established palms.', 'أحواض مرتبة ومسارات أوضح بين أشجار النخيل القائمة.'),
    story: {
      challenge: pair('A dry farm track with indistinct bed edges between established palms.', 'مسار جاف في المزرعة تحيط به أحواض غير واضحة الحواف بين أشجار نخيل قائمة.'),
      approach: pair('Keep the working route open, tidy the bed edges, and add groundcover where watering is practical.', 'إبقاء ممر العمل مفتوحاً وترتيب أطراف الأحواض وإضافة نباتات تغطي التربة حيث يسهل الري.'),
      outcome: pair('Clearer circulation and more defined beds, with the palms remaining the focus.', 'مسار أوضح للحركة وأحواض أكثر تحديداً، مع بقاء النخيل محور المكان.'),
    },
    image: 'farm', beforeAlt: pair('Dry track through rows of palms', 'مسار جاف بين صفوف النخيل'), afterAlt: pair('Same route with tidy beds and green groundcover', 'المسار نفسه مع أحواض مرتبة وغطاء نباتي أخضر'),
    services: ['garden-maintenance', 'plant-and-irrigation'], sample: true },
];
export const products = [
  { title: pair('Soil & growing media', 'التربة وخلطات الزراعة'), copy: pair('Potting mixes, compost and soil amendments for containers and beds.', 'خلطات للأصص وسماد عضوي ومحسنات تربة للأحواض والحاويات.') },
  { title: pair('Fertilizer & nutrition', 'الأسمدة وتغذية النباتات'), copy: pair('Plant nutrition categories for different growth stages and soil conditions.', 'فئات لتغذية النباتات حسب مراحل النمو وظروف التربة.') },
  { title: pair('Seeds & lawn care', 'البذور والعناية بالعشب'), copy: pair('Seed and establishment essentials for lawns and seasonal planting.', 'بذور ومستلزمات التأسيس للمسطحات العشبية والزراعة الموسمية.') },
  { title: pair('Plant & irrigation care', 'العناية بالنباتات والري'), copy: pair('Planting accessories, drip irrigation parts and everyday garden tools.', 'ملحقات الزراعة وقطع الري بالتنقيط وأدوات الحديقة اليومية.') },
] as const;
