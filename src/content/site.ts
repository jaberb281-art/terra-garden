export const locales = ['en', 'ar'] as const;
export type Locale = typeof locales[number];
export type Localized = Readonly<Record<Locale, string>>;
export const pair = (en: string, ar: string): Localized => ({ en, ar });
export const isLocale = (value: string): value is Locale => value === 'en' || value === 'ar';
export const brand = { name: 'AB Gardening', fullName: 'AB Gardening Services', subtitle: pair('Landscaping & Garden Care', 'تنسيق الحدائق وصيانتها') };
export const photo = (name: string) => '/images/' + name + '.webp';
export const navigation = [
  { path: '', label: pair('Home', 'الرئيسية') },
  { path: '/services', label: pair('Services', 'الخدمات') },
  { path: '/projects', label: pair('Projects', 'المشاريع') },
  { path: '/about', label: pair('About', 'من نحن') },
  { path: '/contact', label: pair('Contact', 'تواصل معنا') },
] as const;
export const categories = [
  { id: 'villas', name: pair('Villas & homes', 'الفلل والمنازل'), title: pair('Villas, compounds & homes', 'الفلل والمجمعات والمنازل'), copy: pair('Garden design, lawns, palms and regular maintenance for private villas, residential compounds and apartments.', 'تصميم الحدائق والعناية بالعشب والنخيل والصيانة الدورية للفلل الخاصة والمجمعات السكنية والشقق.'), image: 'villa-after', alt: pair('Lawn and planting at a villa', 'مسطح عشبي ونباتات في حديقة فيلا') },
  { id: 'commercial', name: pair('Offices & schools', 'المكاتب والمدارس'), title: pair('Offices, schools & business', 'المكاتب والمدارس والمنشآت'), copy: pair('Outdoor planting and indoor plant arrangements for offices, commercial buildings, schools and property managers.', 'زراعة خارجية وتنسيق نباتات داخلية للمكاتب والمباني التجارية والمدارس وشركات إدارة العقارات.'), image: 'patio-after', alt: pair('Outdoor seating under a pergola', 'جلسة خارجية تحت مظلة') },
  { id: 'farms', name: pair('Hospitality', 'الضيافة'), title: pair('Hotels, restaurants & spas', 'الفنادق والمطاعم والمنتجعات'), copy: pair('Well-kept grounds, palms and decorative planting for hotels, resorts, cafés, spas and hospitality developments.', 'مساحات منسقة ونخيل وزراعة زخرفية للفنادق والمنتجعات والمقاهي ومراكز العناية والمشاريع السياحية.'), image: 'farm-after', alt: pair('Landscaped path through date palms', 'ممر منسق بين أشجار النخيل') },
] as const;
export const ui = {
  place: pair('Qatar', 'قطر'),
  top: pair('Landscaping & gardening in Doha, Qatar', 'تنسيق الحدائق وصيانتها في الدوحة وقطر'),
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
  contactTitle: pair('Let’s create a beautiful outdoor space.', 'لنصنع معاً مساحة خارجية جميلة.'),
  contactCopy: pair('Free garden inspection and quotation available. Message us today.', 'المعاينة وعرض السعر مجانيان. راسلنا اليوم.'),
  tagline: pair('Professional landscaping, gardening and garden maintenance across Doha and Qatar.', 'تنسيق الحدائق وبستنتها وصيانتها باحتراف في الدوحة وأنحاء قطر.'),
  discover: pair('Discover', 'استكشف'),
  getInTouch: pair('Get in touch', 'تواصل معنا'),
  copyright: pair('Landscaping & Garden Care', 'تنسيق الحدائق وصيانتها'),
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
    title: pair('Landscaping & gardening services in Doha, Qatar', 'تنسيق الحدائق وصيانتها في الدوحة، قطر'),
    description: pair('Professional landscaping, garden design, irrigation, date palm care and garden maintenance for villas and businesses across Doha and Qatar. Free consultation.', 'تنسيق احترافي للحدائق وتصميمها والري والعناية بالنخيل وصيانة الحدائق للفلل والمنشآت في الدوحة وأنحاء قطر. استشارة مجانية.'),
    hero1: pair('Garden care and landscaping across Doha.', 'العناية بالحدائق وتنسيقها في أنحاء الدوحة.'),
    heroCopy: pair('Villas, compounds, offices and hotels. We inspect your garden for free and send your quote on WhatsApp.', 'للفلل والمجمعات والمكاتب والفنادق. نعاين حديقتك مجاناً ونرسل لك عرض السعر عبر واتساب.'),
    heroAlt: pair('Landscaped garden with an olive tree, date palms and lawn in front of a limestone palace', 'حديقة منسّقة فيها شجرة زيتون ونخيل ومسطح عشبي أمام قصر حجري'),
    introTag: pair('How we work', 'كيف نعمل'),
    intro: pair('A clear process, from first call to ongoing care.', 'خطوات واضحة من أول اتصال حتى العناية المستمرة.'),
    introLink: pair('Explore our services', 'استكشف خدماتنا'),
    services: pair('Complete landscaping &', 'حلول متكاملة لتنسيق'),
    servicesAccent: pair('gardening solutions.', 'الحدائق وبستنتها.'),
    audience: pair('Gardening for every type of property.', 'خدمات بستنة لكل أنواع العقارات.'),
    viewProjects: pair('View Our Projects', 'شاهد مشاريعنا'),
    transformations: pair('See what a little care can change.', 'شاهد كيف تُحدث العناية فرقاً.'),
    transformationCopy: pair('Drag the slider to see how planting, layout or care could reshape an outdoor space.', 'حرّك المؤشر لترى كيف يمكن للزراعة أو التخطيط أو العناية أن تبدّل ملامح المساحة الخارجية.'),
    supplies: pair('Professional date palm & garden care.', 'عناية احترافية بالنخيل والحدائق.'),
    suppliesCopy: pair('Date palms and other landscape trees need regular attention in Qatar’s climate. We provide palm cleaning, trimming, dry-leaf removal and general tree maintenance, plus natural grass plantation, seasonal flowers and decorative plants.', 'تحتاج أشجار النخيل وأشجار الحدائق إلى عناية منتظمة في مناخ قطر. نقدم تنظيف النخيل وتشذيبه وإزالة السعف الجاف والعناية العامة بالأشجار، إضافة إلى زراعة العشب الطبيعي والزهور الموسمية والنباتات الزخرفية.'),
    suppliesAlt: pair('Landscaped path lined with date palms', 'ممر منسق تحيط به أشجار النخيل'),
    gallery: pair('Spaces worth coming home to.', 'مساحات تستحق العودة إليها.'),
    galleryCopy: pair('Choose an illustrative concept to explore the idea behind it and the services that fit a similar need.', 'اختر تصوراً توضيحياً للتعرّف إلى فكرته والخدمات التي تناسب احتياجاً مشابهاً.'),
    allServices: pair('View all services', 'عرض كل الخدمات'),
    allProjects: pair('Explore all concepts', 'استكشف جميع التصورات'),
    allProducts: pair('Explore date palm & tree care', 'استكشف العناية بالنخيل والأشجار'),
  },
  services: {
    tag: pair('What we do', 'خدماتنا'),
    title: pair('Complete landscaping & gardening solutions.', 'حلول متكاملة لتنسيق الحدائق وبستنتها.'),
    description: pair('Landscape design, garden maintenance, grass plantation, date palm care, irrigation, indoor plants and soil preparation across Doha and Qatar.', 'تصميم الحدائق وصيانتها وزراعة العشب والعناية بالنخيل والري والنباتات الداخلية وتجهيز التربة في الدوحة وأنحاء قطر.'),
    scope: pair('What the work can include', 'ما قد يشمله العمل'),
    faq: pair('Common questions', 'أسئلة شائعة'),
    related: pair('Explore related services', 'استكشف خدمات ذات صلة'),
  },
  projects: {
    tag: pair('The concept gallery', 'معرض التصورات'),
    title: pair('Imagine what could grow here.', 'تخيّل ما يمكن أن ينمو هنا.'),
    description: pair('Browse illustrative before-and-after concepts for a Qatar villa, an outdoor seating area and a date farm.', 'تصفّح تصورات قبل التنسيق وبعده لحديقة فيلا وجلسة خارجية ومزرعة نخيل في قطر.'),
    disclaimer: pair('These illustrative images depict imagined designs and do not show completed work.', 'تعرض هذه الصور التوضيحية تصاميم تخيلية ولا تمثل أعمالاً منفذة.'),
    overview: pair('The idea behind the concept', 'الفكرة وراء التصور'),
  },
  about: {
    tag: pair('About us', 'من نحن'),
    title: pair('Your trusted gardening & landscaping partner in Qatar.', 'شريكك الموثوق في البستنة وتنسيق الحدائق في قطر.'),
    description: pair('A professional gardening and landscaping service provider dedicated to creating and maintaining beautiful outdoor environments in Qatar.', 'مزوّد خدمات محترف في البستنة وتنسيق الحدائق، يُعنى بإنشاء البيئات الخارجية الجميلة وصيانتها في قطر.'),
    approach: pair('Practical solutions for Qatar’s climate.', 'حلول عملية تناسب مناخ قطر.'),
    body: pair('With an experienced gardening team and a practical understanding of Qatar’s climate, we provide customized solutions for residential and commercial properties, from garden preparation and landscape development to irrigation, plantation and ongoing maintenance. Our commitment: quality workmanship, practical solutions and dependable gardening services.', 'بفريق بستنة خبير وفهم عملي لمناخ قطر، نقدم حلولاً مخصصة للعقارات السكنية والتجارية، من تجهيز الحديقة وتطويرها إلى الري والزراعة والصيانة المستمرة. التزامنا: جودة في التنفيذ وحلول عملية وخدمات بستنة يُعتمد عليها.'),
    steps: [
      [pair('Contact us', 'تواصل معنا'), pair('Tell us about your garden, property or landscaping requirements.', 'أخبرنا عن حديقتك أو عقارك أو متطلبات التنسيق.')],
      [pair('Free inspection', 'معاينة مجانية'), pair('Our team assesses the garden and understands the work required.', 'يعاين فريقنا الحديقة ويفهم العمل المطلوب.')],
      [pair('Customized quotation', 'عرض سعر مخصص'), pair('We prepare a clear quotation based on your requirements and project scope.', 'نعدّ عرض سعر واضحاً بحسب متطلباتك ونطاق المشروع.')],
      [pair('Project execution', 'تنفيذ المشروع'), pair('Our gardening team carries out the agreed work.', 'ينفذ فريق البستنة لدينا العمل المتفق عليه.')],
      [pair('Maintenance & support', 'الصيانة والدعم'), pair('We can arrange ongoing maintenance to keep your garden in excellent condition.', 'يمكننا ترتيب صيانة مستمرة لإبقاء حديقتك في حالة ممتازة.')],
    ],
  },
  contact: {
    tag: pair('Free consultation', 'استشارة مجانية'),
    title: pair('Tell us about your garden.', 'أخبرنا عن حديقتك.'),
    description: pair('Tell us about your property in Qatar and the gardening or landscaping you need. Free garden inspection and quotation available.', 'أخبرنا عن عقارك في قطر وما تحتاجه من أعمال البستنة أو التنسيق. المعاينة وعرض السعر مجانيان.'),
  },
} as const;