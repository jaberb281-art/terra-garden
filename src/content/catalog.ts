import { pair, type Localized } from './site';

export interface Service {
  slug: string;
  title: Localized;
  summary: Localized;
  detail: Localized;
  scope: readonly Localized[];
  faq: readonly [Localized, Localized];
  faqs?: readonly (readonly [Localized, Localized])[];
  art?: { src: string; alt: Localized };
  seo?: { title: Localized; description: Localized };
}
export const services = [
  {
    slug: 'landscape-design', title: pair('Landscape design & development', 'تصميم وتنفيذ الحدائق'),
    summary: pair('Villa garden design, layouts, plantation and garden transformation.', 'تصميم حدائق الفلل وتخطيطها وزراعتها وتجديدها.'),
    detail: pair('We plan the layout around how the space is used and what suits Qatar’s climate, then carry the design through to planting and finishing.', 'نخطط المساحة بحسب طريقة استخدامها وما يلائم مناخ قطر، ثم ننفذ التصميم حتى الزراعة واللمسات النهائية.'),
    scope: [
      pair('Modern villa garden design', 'تصميم عصري لحدائق الفلل'),
      pair('Residential and commercial landscaping', 'تنسيق الحدائق السكنية والتجارية'),
      pair('Garden layout planning', 'تخطيط توزيع الحديقة'),
      pair('Decorative garden arrangements', 'تنسيقات زخرفية للحديقة'),
      pair('Outdoor plantation and greenery', 'الزراعة والمساحات الخضراء الخارجية'),
      pair('Garden renovation and transformation', 'تجديد الحدائق وتحويلها'),
      pair('2D and 3D landscape design concepts', 'تصورات تصميم ثنائية وثلاثية الأبعاد'),
    ],
    faq: [pair('Can you design and develop a new villa garden?', 'هل يمكنكم تصميم وتنفيذ حديقة فيلا جديدة؟'), pair('Yes. We provide garden planning, landscaping, soil preparation, plantation, irrigation and decorative arrangements.', 'نعم، نقدم تخطيط الحدائق وتنسيقها وتجهيز التربة والزراعة والري والتنسيقات الزخرفية.')],
  },
  {
    slug: 'garden-maintenance', title: pair('Garden maintenance', 'صيانة الحدائق'),
    summary: pair('Weekly or monthly care: lawn, watering, weeds, pruning and seasonal work.', 'عناية أسبوعية أو شهرية: العشب والري والأعشاب والتقليم والأعمال الموسمية.'),
    detail: pair('Regular visits keep a garden tidy and help spot problems early. Arrangements can be one-time, weekly or monthly, for homes and businesses.', 'تحافظ الزيارات الدورية على ترتيب الحديقة وتكشف المشكلات مبكراً. ويمكن أن تكون الخدمة لمرة واحدة أو أسبوعية أو شهرية للمنازل والمنشآت.'),
    scope: [
      pair('Weekly and monthly garden maintenance', 'صيانة أسبوعية وشهرية للحديقة'),
      pair('Lawn mowing and grass trimming', 'قص العشب وتشذيبه'),
      pair('Plant watering and health inspections', 'ري النباتات وفحص حالتها الصحية'),
      pair('Weed removal and soil maintenance', 'إزالة الأعشاب الضارة والعناية بالتربة'),
      pair('Tree pruning and trimming', 'تقليم الأشجار وتشذيبها'),
      pair('Decorative plant maintenance', 'العناية بالنباتات الزخرفية'),
      pair('Seasonal gardening services', 'خدمات بستنة موسمية'),
    ],
    faq: [pair('Do you offer monthly garden maintenance?', 'هل تقدمون صيانة شهرية للحدائق؟'), pair('Yes. We provide flexible weekly and monthly maintenance arrangements for residential and commercial properties.', 'نعم، نقدم ترتيبات مرنة للصيانة الأسبوعية والشهرية للعقارات السكنية والتجارية.')],
  },
  {
    slug: 'grass-cutting', title: pair('Grass cutting', 'قص العشب'),
    summary: pair('Mowing, edging and upkeep for an existing lawn.', 'قص العشب وتشذيب الحواف والعناية بالمسطح العشبي القائم.'),
    detail: pair('A clean cut starts with checking the grass type, its growth and how the area is used. Cutting height and timing can then be adjusted as heat and growth change through the season.', 'يبدأ القص الجيد بتحديد نوع العشب ومعدل نموه وطريقة استخدام المساحة، ثم تُضبط مواعيد القص وارتفاعه مع تغيّر الحرارة والنمو خلال الموسم.'),
    scope: [
      pair('Mowing to a height suited to the turf', 'قص العشب بارتفاع يناسب نوعه'),
      pair('Edge trimming around paths and planting beds', 'تشذيب الحواف حول الممرات وأحواض الزراعة'),
      pair('Clearing clippings from adjacent paving', 'إزالة بقايا القص عن الأرضيات المجاورة'),
    ],
    faq: [pair('Can the mowing schedule change by season?', 'هل يتغير جدول القص حسب الموسم؟'), pair('Yes. Frequency can be adjusted to actual growth, turf condition and watering.', 'نعم، يمكن ضبط وتيرة القص وفقاً لمعدل النمو وحالة العشب والري.')],
  },
  {
    slug: 'grass-plantation', title: pair('Grass plantation', 'زراعة العشب'),
    summary: pair('Natural lawn installation, soil preparation, renovation and lawn nutrition.', 'تركيب العشب الطبيعي وتجهيز التربة وتجديد المسطحات وتغذيتها.'),
    detail: pair('A healthy lawn starts with the soil. We prepare and level the ground, plant natural grass and can arrange fertilization and ongoing lawn care.', 'يبدأ العشب الصحي من التربة. نجهّز الأرض ونسوّيها ونزرع العشب الطبيعي، ويمكن ترتيب التسميد والعناية المستمرة.'),
    scope: [
      pair('Professional grass plantation', 'زراعة عشب احترافية'),
      pair('Natural lawn installation', 'تركيب عشب طبيعي'),
      pair('Soil preparation and leveling', 'تجهيز التربة وتسويتها'),
      pair('Lawn renovation and replacement', 'تجديد المسطحات العشبية واستبدالها'),
      pair('Grass fertilization and nutrition', 'تسميد العشب وتغذيته'),
      pair('Lawn maintenance and restoration', 'صيانة العشب وإعادة تأهيله'),
    ],
    faq: [pair('Can you replace a worn-out lawn?', 'هل يمكنكم استبدال عشب متضرر؟'), pair('Yes. Lawn renovation and replacement are part of our grass plantation service.', 'نعم، تجديد المسطحات العشبية واستبدالها جزء من خدمة زراعة العشب.')],
  },
  {
    slug: 'date-palm-tree-care', title: pair('Date palm & tree care', 'العناية بالنخيل والأشجار'),
    summary: pair('Palm cleaning, trimming, dry-leaf removal and tree pruning.', 'تنظيف النخيل وتشذيبه وإزالة السعف الجاف وتقليم الأشجار.'),
    detail: pair('Date palms and landscape trees need regular attention in Qatar’s climate. This is one of our specialties, helping keep palms and trees neat and well maintained.', 'تحتاج أشجار النخيل وأشجار الحدائق إلى عناية منتظمة في مناخ قطر. وهذه من تخصصاتنا، إذ نساعد في الحفاظ على النخيل والأشجار مرتبة وبحالة جيدة.'),
    scope: [
      pair('Date palm cleaning and maintenance', 'تنظيف النخيل وصيانته'),
      pair('Palm tree trimming', 'تشذيب النخيل'),
      pair('Dry leaf and unwanted growth removal', 'إزالة السعف الجاف والنموات غير المرغوبة'),
      pair('Tree pruning and shaping', 'تقليم الأشجار وتشكيلها'),
      pair('Washingtonia palm maintenance', 'صيانة نخيل الواشنطونيا'),
      pair('General tree care and plantation', 'العناية العامة بالأشجار وزراعتها'),
    ],
    faq: [pair('What does palm care include?', 'ماذا تشمل العناية بالنخيل؟'), pair('Cleaning, trimming, removal of dry leaves and unwanted growth, and general tree care.', 'التنظيف والتشذيب وإزالة السعف الجاف والنموات غير المرغوبة والعناية العامة بالأشجار.')],
  },
  {
    slug: 'irrigation-systems', title: pair('Irrigation systems', 'أنظمة الري'),
    summary: pair('Automatic, drip and micro-sprinkler installation, plus inspection and repair.', 'تركيب أنظمة الري الأوتوماتيكي والتنقيط والرشاشات الصغيرة مع الفحص والإصلاح.'),
    detail: pair('The right irrigation keeps plants consistently watered. We install, inspect and repair systems for gardens of different sizes.', 'يساعد الري المناسب على سقي النباتات بانتظام. نقوم بتركيب أنظمة الري وفحصها وإصلاحها لحدائق بمختلف المساحات.'),
    scope: [
      pair('Automatic irrigation installation', 'تركيب أنظمة ري أوتوماتيكية'),
      pair('Drip irrigation systems', 'أنظمة الري بالتنقيط'),
      pair('Micro-sprinkler installation', 'تركيب رشاشات صغيرة'),
      pair('Garden irrigation pipe installation', 'تمديد أنابيب الري في الحديقة'),
      pair('Irrigation timers and controllers', 'مؤقتات ووحدات تحكم الري'),
      pair('Water filters and pressure regulators', 'فلاتر المياه ومنظمات الضغط'),
      pair('Irrigation inspection and repair', 'فحص الري وإصلاحه'),
    ],
    faq: [pair('Do you install automatic irrigation systems?', 'هل تركّبون أنظمة ري أوتوماتيكية؟'), pair('Yes. We install and maintain automatic irrigation systems, drip irrigation, sprinklers, timers and related components.', 'نعم، نركّب أنظمة الري الأوتوماتيكي والتنقيط والرشاشات والمؤقتات والمكونات المرتبطة بها ونتولى صيانتها.')],
  },
  {
    slug: 'indoor-plants', title: pair('Indoor plants & decoration', 'النباتات الداخلية والديكور'),
    summary: pair('Indoor plant selection, installation and care for homes, offices and businesses.', 'اختيار النباتات الداخلية وتركيبها والعناية بها للمنازل والمكاتب والمنشآت.'),
    detail: pair('We supply and install suitable indoor plants and decorative arrangements, and can look after them afterwards.', 'نوفّر النباتات الداخلية المناسبة والتنسيقات الزخرفية ونركّبها، ويمكننا العناية بها بعد ذلك.'),
    scope: [
      pair('Indoor plant selection and installation', 'اختيار النباتات الداخلية وتركيبها'),
      pair('Office and commercial plant arrangements', 'تنسيق النباتات للمكاتب والمساحات التجارية'),
      pair('Decorative indoor plantation', 'زراعة داخلية زخرفية'),
      pair('Indoor planter arrangements', 'تنسيق أحواض النباتات الداخلية'),
      pair('Soil preparation and plant nutrition', 'تجهيز التربة وتغذية النباتات'),
      pair('Indoor plant maintenance', 'صيانة النباتات الداخلية'),
    ],
    faq: [pair('Do you provide indoor plant installation?', 'هل تقدمون تركيب النباتات الداخلية؟'), pair('Yes. We supply and install suitable indoor plants and decorative arrangements for homes, offices and commercial spaces.', 'نعم، نوفّر النباتات الداخلية المناسبة والتنسيقات الزخرفية ونركّبها للمنازل والمكاتب والمساحات التجارية.')],
  },
  {
    slug: 'soil-fertilization', title: pair('Soil preparation & fertilization', 'تجهيز التربة والتسميد'),
    summary: pair('Soil improvement, organic manure, potting soil and plant nutrition programs.', 'تحسين التربة والسماد العضوي وتربة الزراعة وبرامج تغذية النباتات.'),
    detail: pair('Good soil and the right nutrition help plants and lawns grow well. We improve the soil and apply fertilizers for what is growing.', 'تساعد التربة الجيدة والتغذية المناسبة النباتات والعشب على النمو جيداً. نحسّن التربة ونضيف الأسمدة بحسب ما هو مزروع.'),
    scope: [
      pair('Soil improvement and preparation', 'تحسين التربة وتجهيزها'),
      pair('Organic manure application', 'إضافة السماد العضوي'),
      pair('German potting soil', 'تربة زراعة ألمانية'),
      pair('NPK fertilizer application', 'إضافة سماد NPK'),
      pair('Plant vitamins and minerals', 'فيتامينات ومعادن للنباتات'),
      pair('Lawn and plant nutrition programs', 'برامج تغذية العشب والنباتات'),
    ],
    faq: [pair('Do you offer lawn and plant nutrition programs?', 'هل تقدمون برامج لتغذية العشب والنباتات؟'), pair('Yes. Lawn and plant nutrition programs are part of our soil and fertilization service.', 'نعم، برامج تغذية العشب والنباتات جزء من خدمة تجهيز التربة والتسميد.')],
  },
  {
    slug: 'garden-cleaning', title: pair('Garden cleaning & preparation', 'تنظيف الحدائق وتجهيزها'),
    summary: pair('Clean-up of overgrown gardens, soil digging and seasonal preparation.', 'تنظيف الحدائق المهملة وحفر التربة والتجهيز الموسمي.'),
    detail: pair('A neglected or new garden often needs clearing before anything else. We clean, dig and prepare the ground, then finish and decorate.', 'تحتاج الحديقة المهملة أو الجديدة غالباً إلى تنظيف قبل أي عمل آخر. ننظّف الأرض ونحفرها ونجهّزها، ثم نضيف اللمسات النهائية والزينة.'),
    scope: [
      pair('Initial garden cleaning', 'التنظيف الأولي للحديقة'),
      pair('Overgrown garden restoration', 'إعادة تأهيل الحدائق المهملة'),
      pair('Removal of dry plants and unwanted growth', 'إزالة النباتات الجافة والنموات غير المرغوبة'),
      pair('Soil digging and preparation', 'حفر التربة وتجهيزها'),
      pair('Garden decoration and finishing', 'تزيين الحديقة واللمسات النهائية'),
      pair('Seasonal garden preparation', 'تجهيز الحديقة للموسم'),
    ],
    faq: [pair('Can you handle one-day gardening projects?', 'هل تنفذون مشاريع بستنة ليوم واحد؟'), pair('Yes. We undertake both one-time gardening projects and long-term maintenance contracts, depending on the project requirements.', 'نعم، ننفذ مشاريع البستنة لمرة واحدة وعقود الصيانة طويلة الأمد بحسب متطلبات المشروع.')],
  },
] as const satisfies readonly Service[];

export type ServiceSlug = typeof services[number]['slug'];
export type SiteService = Service & { slug: ServiceSlug };
export type ProjectPhoto = { src: string; alt: Localized; width: number; height: number; caption?: Localized };
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
  location?: Localized;
  seo?: { title: Localized; description: Localized };
  media?: { before: ProjectPhoto; after: ProjectPhoto; gallery: ProjectPhoto[] };
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
    services: ['landscape-design', 'grass-plantation', 'irrigation-systems'], sample: true },
  { slug: 'outdoor-living-renewal', category: 'commercial', title: pair('Outdoor living renewal', 'تجديد جلسة خارجية'),
    summary: pair('A paved terrace reimagined as a place to pause.', 'تخيّل شرفة مرصوفة تتحول إلى مكان للاستراحة.'),
    story: {
      challenge: pair('An empty paved terrace with shade but no defined place to sit.', 'شرفة مرصوفة وفارغة تتوفر فيها الظلال دون مكان محدد للجلوس.'),
      approach: pair('Use the existing pergola to define a seating area, plant around the edge, and keep the paved route clear.', 'استخدام المظلة القائمة لتحديد منطقة جلوس، وإضافة نباتات عند الحواف، وإبقاء المسار المرصوف مفتوحاً.'),
      outcome: pair('A sheltered place to pause with planting that leaves room for everyday movement.', 'مكان مظلل للاستراحة تحيط به نباتات تترك مساحة للحركة اليومية.'),
    },
    image: 'patio', beforeAlt: pair('Bare paved terrace under a pergola', 'شرفة مرصوفة فارغة تحت مظلة'), afterAlt: pair('Same terrace with seating and ornamental grasses', 'الشرفة نفسها مع مقاعد وأعشاب للزينة'),
    services: ['landscape-design', 'garden-maintenance'], sample: true },
  { slug: 'farm-landscape-care', category: 'farms', title: pair('Farm landscape care', 'العناية بمساحات المزرعة'),
    summary: pair('Tidy beds and clearer circulation among established palms.', 'أحواض مرتبة ومسارات أوضح بين أشجار النخيل القائمة.'),
    story: {
      challenge: pair('A dry farm track with indistinct bed edges between established palms.', 'مسار جاف في المزرعة تحيط به أحواض غير واضحة الحواف بين أشجار نخيل قائمة.'),
      approach: pair('Keep the working route open, tidy the bed edges, and add groundcover where watering is practical.', 'إبقاء ممر العمل مفتوحاً وترتيب أطراف الأحواض وإضافة نباتات تغطي التربة حيث يسهل الري.'),
      outcome: pair('Clearer circulation and more defined beds, with the palms remaining the focus.', 'مسار أوضح للحركة وأحواض أكثر تحديداً، مع بقاء النخيل محور المكان.'),
    },
    image: 'farm', beforeAlt: pair('Dry track through rows of palms', 'مسار جاف بين صفوف النخيل'), afterAlt: pair('Same route with tidy beds and green groundcover', 'المسار نفسه مع أحواض مرتبة وغطاء نباتي أخضر'),
    services: ['date-palm-tree-care', 'irrigation-systems'], sample: true },
];