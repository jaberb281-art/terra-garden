export const locales = ['en', 'ar'] as const;
export type Locale = typeof locales[number];
export type Localized = Readonly<Record<Locale, string>>;
export const pair = (en: string, ar: string): Localized => ({ en, ar });
export const isLocale = (value: string): value is Locale => value === 'en' || value === 'ar';
export const brand = { name: 'TERRA', subtitle: pair('Garden & Landscape', 'للحدائق وتنسيق المساحات الخارجية') };
export const photo = (name: string) => '/images/' + name + '.webp';
export const navigation = [
  { path: '', label: pair('Home', 'الرئيسية') },
  { path: '/services', label: pair('Services', 'الخدمات') },
  { path: '/projects', label: pair('Projects', 'المشاريع') },
  { path: '/products', label: pair('Products', 'المنتجات') },
  { path: '/about', label: pair('About', 'من نحن') },
  { path: '/contact', label: pair('Contact', 'تواصل معنا') },
] as const;
export const categories = [
  { id: 'villas', name: pair('Villas', 'الفلل'), title: pair('Private villas', 'الفلل الخاصة'), copy: pair('Lawn and bed care, courtyard planting, or a layout that makes more room for everyday use.', 'العناية بالعشب والأحواض، أو زراعة الفناء، أو تعديل التخطيط لتوفير مساحة أكبر للاستخدام اليومي.'), image: 'villa-after', alt: pair('Lawn and planting at a villa', 'مسطح عشبي ونباتات في حديقة فيلا') },
  { id: 'commercial', name: pair('Commercial', 'المساحات التجارية'), title: pair('Commercial spaces', 'المساحات التجارية'), copy: pair('Planted entrances, tidy paths and outdoor seating that keeps visitor routes clear.', 'مداخل مزروعة وممرات مرتبة وجلسات خارجية تترك مسارات الزوار مفتوحة.'), image: 'patio-after', alt: pair('Outdoor seating under a pergola', 'جلسة خارجية تحت مظلة') },
  { id: 'farms', name: pair('Farms', 'المزارع'), title: pair('Farms & larger spaces', 'المزارع والمساحات الواسعة'), copy: pair('Bed edges, practical watering and planting that leaves working routes open.', 'العناية بحواف الأحواض وتنظيم الري والزراعة مع إبقاء ممرات العمل مفتوحة.'), image: 'farm-after', alt: pair('Landscaped path through date palms', 'ممر منسق بين أشجار النخيل') },
] as const;
export const ui = {
  place: pair('Qatar', 'قطر'),
  top: pair('GARDEN CARE & LANDSCAPING IN QATAR', 'العناية بالحدائق وتنسيق المساحات الخارجية في قطر'),
  sample: pair('Sample imagery', 'صور توضيحية'),
  demo: pair('Illustrative concept · Sample imagery', 'تصور توضيحي · صور نموذجية'),
  before: pair('Before', 'قبل'),
  after: pair('After', 'بعد'),
  compare: pair('Reveal the before image', 'اكشف الصورة قبل التنسيق'),
  drag: pair('Drag the handle to compare', 'اسحب المقبض للمقارنة'),
  view: pair('View concept', 'شاهد التصور'),
  skip: pair('Skip to content', 'انتقل إلى المحتوى'),
  mainNav: pair('Main navigation', 'القائمة الرئيسية'),
  openMenu: pair('Open menu', 'افتح القائمة'),
  close: pair('Close', 'إغلاق'),
  contactTitle: pair('Let’s talk about your garden.', 'لنتحدث عن حديقتك.'),
  contactCopy: pair('From a single visit to a fresh layout, tell us what you have in mind.', 'سواء أردت زيارة واحدة أو تصميماً جديداً، أخبرنا بما تفكر فيه.'),
  tagline: pair('Thoughtful outdoor spaces and everyday garden care for Qatar.', 'مساحات خارجية مدروسة وعناية يومية بالحدائق في قطر.'),
  discover: pair('Discover', 'استكشف'),
  getInTouch: pair('Get in touch', 'تواصل معنا'),
  copyright: pair('Garden & Landscape', 'للحدائق وتنسيق المساحات الخارجية'),
  all: pair('All concepts', 'كل التصورات'),
  empty: pair('There are no concepts in this category yet.', 'لا توجد تصورات في هذه الفئة بعد.'),
  gallery: pair('Image gallery', 'معرض الصور'),
  openPhoto: pair('Enlarge image', 'كبّر الصورة'),
  notFound: pair('This path doesn’t lead anywhere.', 'هذا المسار لا يقود إلى صفحة.'),
  lost: pair('The page may have moved or the address may be incomplete.', 'ربما نُقلت الصفحة أو أن عنوانها غير مكتمل.'),
  backHome: pair('Back to home', 'العودة إلى الرئيسية'),
} as const;
export const copy = {
  home: {
    title: pair('Garden care and landscaping in Qatar', 'العناية بالحدائق وتنسيق المساحات الخارجية في قطر'),
    description: pair('Explore TERRA’s lawn care, garden maintenance, landscaping and planting concepts for villas, commercial spaces and farms in Qatar.', 'استكشف خدمات تيرا للعناية بالعشب وصيانة الحدائق وتنسيق المساحات والزراعة للفلل والمنشآت والمزارع في قطر.'),
    hero1: pair('Beautiful spaces.', 'مساحات جميلة.'),
    hero2: pair('Naturally cared for.', 'وعناية تنسجم مع الطبيعة.'),
    heroCopy: pair('Keep an existing garden in shape or improve your outdoor space with a new layout, planting or irrigation. Explore garden care and landscaping in Qatar.', 'اعتنِ بحديقتك الحالية أو حسّن مساحتك الخارجية بتخطيط جديد أو زراعة أو ري مناسب. استكشف خدمات العناية بالحدائق وتنسيق المساحات الخارجية في قطر.'),
    heroAlt: pair('Sunlit path through palms and grasses beside a limestone villa', 'ممر مشمس بين النخيل والأعشاب بجوار فيلا حجرية'),
    introTag: pair('THE TERRA APPROACH', 'نهج تيرا'),
    intro: pair('Good gardens begin with care.', 'الحدائق الجميلة تبدأ بالعناية.'),
    introLink: pair('Explore garden care', 'استكشف خدمات العناية بالحدائق'),
    services: pair('Rooted in the', 'العناية تبدأ من'),
    servicesAccent: pair('details.', 'التفاصيل.'),
    audience: pair('Exceptional care, wherever you grow.', 'عناية مميزة أينما تنمو مساحاتك.'),
    viewProjects: pair('View Our Projects', 'شاهد مشاريعنا'),
    transformations: pair('See what a little care can change.', 'شاهد كيف تُحدث العناية فرقاً.'),
    transformationCopy: pair('Drag the slider to see how a change in planting, layout or care could reshape an outdoor space.', 'حرّك المؤشر لترى كيف يمكن لتغيير الزراعة أو التخطيط أو أسلوب العناية أن يبدّل ملامح المساحة الخارجية.'),
    supplies: pair('Good things grow from the ground up.', 'النمو الجيد يبدأ من التربة.'),
    suppliesCopy: pair('Find the right starting point for your garden, from soil and seed to everyday planting and irrigation essentials.', 'اعثر على ما تحتاجه لتبدأ، من التربة والبذور إلى مستلزمات الزراعة والري اليومية.'),
    suppliesAlt: pair('Terracotta pots, seedlings and soil on a nursery workbench', 'أصص فخارية وشتلات وتربة على طاولة عمل في مشتل'),
    gallery: pair('Spaces worth coming home to.', 'مساحات تستحق العودة إليها.'),
    galleryCopy: pair('Choose a concept to explore the idea behind it and find services that fit a similar need.', 'اختر تصوراً للتعرّف إلى فكرته والخدمات التي قد تناسب احتياجاً مشابهاً.'),
    allServices: pair('View all services', 'عرض كل الخدمات'),
    allProjects: pair('Explore all concepts', 'استكشف جميع التصورات'),
    allProducts: pair('Browse garden essentials', 'تصفّح مستلزمات الحديقة'),
  },
  services: {
    tag: pair('WHAT WE DO', 'خدماتنا'),
    title: pair('Garden care, from the ground up.', 'عناية بالحدائق من الجذور إلى التفاصيل.'),
    description: pair('Explore lawn care, seasonal maintenance, landscape design, planting and irrigation for Qatar’s villas, businesses and farms.', 'تعرّف على العناية بالعشب والصيانة الموسمية وتصميم الحدائق والزراعة والري للفلل والمنشآت والمزارع في قطر.'),
    scope: pair('What the work can include', 'ما قد يشمله العمل'),
    faq: pair('Common questions', 'أسئلة شائعة'),
    related: pair('Explore related services', 'استكشف خدمات ذات صلة'),
  },
  projects: {
    tag: pair('THE CONCEPT GALLERY', 'معرض التصورات'),
    title: pair('Imagine what could grow here.', 'تخيّل ما يمكن أن ينمو هنا.'),
    description: pair('Browse illustrative before-and-after concepts for a Qatar villa, an outdoor seating area and a date farm.', 'تصفّح تصورات قبل التنسيق وبعده لحديقة فيلا وجلسة خارجية ومزرعة نخيل في قطر.'),
    disclaimer: pair('These illustrative images depict imagined designs and do not show completed TERRA work.', 'تعرض هذه الصور التوضيحية تصاميم تخيلية ولا تمثل أعمالاً نفذتها تيرا.'),
    overview: pair('The idea behind the concept', 'الفكرة وراء التصور'),
  },
  products: {
    tag: pair('GARDEN ESSENTIALS', 'مستلزمات الحديقة'),
    title: pair('Start with the essentials.', 'ابدأ بالمستلزمات الأساسية.'),
    description: pair('Explore categories for soil preparation, plant nutrition, seeding and everyday planting and irrigation care.', 'استكشف فئات تجهيز التربة وتغذية النباتات والبذور ومستلزمات الزراعة والري اليومية.'),
    note: pair('This guide shows types of garden supplies. Availability and ordering arrangements need confirmation from TERRA.', 'يعرض هذا الدليل أنواع مستلزمات الحدائق. يتطلب التوافر وترتيبات الطلب تأكيداً من تيرا.'),
  },
  about: {
    tag: pair('ABOUT TERRA', 'عن تيرا'),
    title: pair('Care for the places we grow.', 'عناية بالأماكن التي ننمو فيها.'),
    description: pair('TERRA is a garden care and landscaping brand concept for outdoor spaces in Qatar, shaped around practical care and thoughtful planting.', 'تيرا هوية مقترحة لخدمات الحدائق وتنسيق المساحات الخارجية في قطر، ترتكز على العناية العملية والزراعة المدروسة.'),
    approach: pair('A garden should fit the way you live.', 'ينبغي أن تناسب الحديقة أسلوب حياتك.'),
    body: pair('A shaded courtyard in Doha has different needs from an exposed lawn or a date farm. Our approach starts with the site: how it is used, where the sun falls, and how much care the planting will need over time.', 'تختلف احتياجات فناء مظلل في الدوحة عن مسطح عشبي مكشوف أو مزرعة نخيل. يبدأ نهجنا بالموقع: كيف يُستخدم، وأين تسقط أشعة الشمس، وما مقدار العناية التي تحتاجها النباتات مع الوقت.'),
    steps: [
      [pair('Observe', 'نلاحظ'), pair('Consider the light, soil, watering and how you use the space.', 'نراعي الضوء والتربة والري وطريقة استخدامك للمساحة.')],
      [pair('Plan', 'نخطط'), pair('Choose plants and a scope of work that suit the conditions.', 'نختار النباتات ونطاق العمل بما يناسب ظروف الموقع.')],
      [pair('Care', 'نعتني'), pair('Plan for seasonal watering, pruning and upkeep from the start.', 'نراعي من البداية احتياجات الري الموسمي والتقليم والصيانة.')],
    ],
  },
  contact: {
    tag: pair('CONTACT & QUOTES', 'التواصل وعروض الأسعار'),
    title: pair('Tell us what you’d like to grow.', 'أخبرنا بما تطمح إلى زراعته.'),
    description: pair('Tell us about your property in Qatar and the garden care or landscaping you have in mind.', 'أخبرنا عن عقارك في قطر وما تفكر فيه من أعمال العناية بالحديقة أو تنسيق المساحات الخارجية.'),
  },
} as const;
