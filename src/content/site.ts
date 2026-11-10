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
  { id: 'villas', name: pair('Villas', 'الفلل'), title: pair('Private villas', 'الفلل الخاصة'), copy: pair('A garden that feels like an extension of home.', 'حديقة تشعرك بأنها امتداد لمنزلك.'), image: 'villa-after', alt: pair('Lawn and planting at a villa', 'مسطح عشبي ونباتات في حديقة فيلا') },
  { id: 'commercial', name: pair('Commercial', 'المساحات التجارية'), title: pair('Commercial spaces', 'المساحات التجارية'), copy: pair('Welcoming outdoor areas for visitors and teams.', 'مساحات خارجية ترحّب بالزوار وفرق العمل.'), image: 'patio-after', alt: pair('Outdoor seating under a pergola', 'جلسة خارجية تحت مظلة') },
  { id: 'farms', name: pair('Farms', 'المزارع'), title: pair('Farms & estates', 'المزارع والعقارات الواسعة'), copy: pair('Practical care for grounds with room to grow.', 'عناية عملية بالأراضي الواسعة ومساحات الزراعة.') , image: 'farm-after', alt: pair('Landscaped path through date palms', 'ممر منسق بين أشجار النخيل') },
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
    heroCopy: pair('Garden care and considered landscaping for the places you live, work and grow in Qatar.', 'عناية بالحدائق وتنسيق مدروس للأماكن التي تعيش وتعمل وتزرع فيها في قطر.'),
    heroAlt: pair('Sunlit path through palms and grasses beside a limestone villa', 'ممر مشمس بين النخيل والأعشاب بجوار فيلا حجرية'),
    introTag: pair('THE TERRA APPROACH', 'نهج تيرا'),
    intro: pair('Good gardens begin with care.', 'الحدائق الجميلة تبدأ بالعناية.'),
    introCopy: pair('We choose plants for the light your garden gets. We adjust watering with the seasons and keep growth in check with regular pruning.', 'نختار نباتات تناسب كمية الضوء التي تصل إلى حديقتك. ونضبط الري بحسب الموسم وننظّم نمو النباتات بالتقليم المنتظم.'),
    introLink: pair('Explore garden care', 'استكشف خدمات العناية بالحدائق'),
    services: pair('Rooted in the', 'العناية تبدأ من'),
    servicesAccent: pair('details.', 'التفاصيل.'),
    audience: pair('Exceptional care, wherever you grow.', 'عناية مميزة أينما تنمو مساحاتك.'),
    viewProjects: pair('View Our Projects', 'شاهد مشاريعنا'),
    transformations: pair('See what a little care can change.', 'شاهد كيف تُحدث العناية فرقاً.'),
    transformationCopy: pair('Compare three garden concepts to see how thoughtful planting and care can change an outdoor space.', 'قارن بين ثلاثة تصورات لحدائق، وشاهد كيف تغيّر الزراعة المدروسة والعناية ملامح المساحات الخارجية.'),
    supplies: pair('Good things grow from the ground up.', 'النمو الجيد يبدأ من التربة.'),
    suppliesCopy: pair('Find the right starting point for your garden, from soil and seed to everyday planting and irrigation essentials.', 'اعثر على ما تحتاجه لتبدأ، من التربة والبذور إلى مستلزمات الزراعة والري اليومية.'),
    suppliesAlt: pair('Terracotta pots, seedlings and soil on a nursery workbench', 'أصص فخارية وشتلات وتربة على طاولة عمل في مشتل'),
    gallery: pair('Spaces worth coming home to.', 'مساحات تستحق العودة إليها.'),
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
    note: pair('Display catalogue. Ask about suitability and availability for your garden.', 'دليل للعرض. استفسر عن الملاءمة والتوافر لحديقتك.'),
  },
  about: {
    tag: pair('ABOUT TERRA', 'عن تيرا'),
    title: pair('Care for the places we grow.', 'عناية بالأماكن التي ننمو فيها.'),
    description: pair('TERRA is a garden care and landscaping brand concept for outdoor spaces in Qatar, shaped around practical care and thoughtful planting.', 'تيرا هوية مقترحة لخدمات الحدائق وتنسيق المساحات الخارجية في قطر، ترتكز على العناية العملية والزراعة المدروسة.'),
    approach: pair('A garden should fit the way you live.', 'ينبغي أن تناسب الحديقة أسلوب حياتك.'),
    body: pair('A shaded courtyard in Doha has different needs from an exposed lawn or a date farm. Our approach starts with the site: how it is used, where the sun falls, and how much care the planting will need over time.', 'تختلف احتياجات فناء مظلل في الدوحة عن مسطح عشبي مكشوف أو مزرعة نخيل. يبدأ نهجنا بالموقع: كيف يُستخدم، وأين تسقط أشعة الشمس، وما مقدار العناية التي تحتاجها النباتات مع الوقت.'),
    steps: [
      [pair('Observe', 'نلاحظ'), pair('Look at light, soil, water and how people move through the space.', 'ندرس الضوء والتربة والمياه وكيفية حركة الناس في المكان.')],
      [pair('Plan', 'نخطط'), pair('Choose a realistic scope and plants that suit the conditions.', 'نحدد نطاق عمل واقعياً ونختار نباتات تناسب ظروف الموقع.')],
      [pair('Care', 'نعتني'), pair('Make ongoing maintenance part of the plan from the start.', 'نجعل الصيانة المستمرة جزءاً من الخطة منذ البداية.')],
    ],
  },
  contact: {
    tag: pair('CONTACT & QUOTES', 'التواصل وعروض الأسعار'),
    title: pair('Tell us what you’d like to grow.', 'أخبرنا بما تطمح إلى زراعته.'),
    description: pair('Tell us about your property in Qatar and the garden care or landscaping you have in mind.', 'أخبرنا عن عقارك في قطر وما تفكر فيه من أعمال العناية بالحديقة أو تنسيق المساحات الخارجية.'),
  },
} as const;
