import { pair, type Localized } from './site';
import type { ServiceSlug } from './catalog';

export const servicePaths = [
  {
    id: 'maintain',
    choice: pair('Care for my garden', 'العناية بحديقتي'),
    title: pair('Garden care & upkeep', 'العناية بالحدائق وصيانتها'),
    description: pair('Regular maintenance, lawns, date palms and tree care, and clean-ups for gardens that need attention.', 'صيانة دورية وعناية بالعشب والنخيل والأشجار وأعمال تنظيف للحدائق التي تحتاج إلى عناية.'),
    services: ['garden-maintenance', 'grass-cutting', 'grass-plantation', 'date-palm-tree-care', 'garden-cleaning'],
  },
  {
    id: 'improve',
    choice: pair('Build or improve a space', 'إنشاء مساحة أو تحسينها'),
    title: pair('Design, build & improve', 'التصميم والتنفيذ والتحسين'),
    description: pair('Landscape design, irrigation, indoor plants and soil preparation for new or renovated spaces.', 'تصميم الحدائق والري والنباتات الداخلية وتجهيز التربة للمساحات الجديدة أو المجددة.'),
    services: ['landscape-design', 'irrigation-systems', 'indoor-plants', 'soil-fertilization'],
  },
] as const satisfies readonly {
  id: string;
  choice: Localized;
  title: Localized;
  description: Localized;
  services: readonly ServiceSlug[];
}[];

export const serviceGuidance = {
  'landscape-design': {
    suitable: pair('For a new villa garden, a renovation, or a commercial landscape that needs planning from the start.', 'للحدائق الجديدة أو أعمال التجديد أو المساحات التجارية التي تحتاج إلى تخطيط من البداية.'),
    prepare: pair('Set aside photos from a few angles, approximate dimensions and a short list of what you want to keep, change or add.', 'جهّز صوراً من عدة زوايا وأبعاداً تقريبية وقائمة قصيرة بما تريد الإبقاء عليه أو تغييره أو إضافته.'),
    faq: [pair('Do you provide design concepts?', 'هل تقدمون تصورات للتصميم؟'), pair('We offer 2D and 3D landscape design concepts. Ask us about them when you request your free consultation.', 'نقدم تصورات تصميم ثنائية وثلاثية الأبعاد. اسألنا عنها عند طلب استشارتك المجانية.')],
  },
  'garden-maintenance': {
    suitable: pair('For gardens that need regular upkeep, whether you want a one-time tidy-up or an ongoing weekly or monthly plan.', 'للحدائق التي تحتاج إلى عناية منتظمة، سواء لترتيب لمرة واحدة أو لخطة أسبوعية أو شهرية.'),
    prepare: pair('List the lawn, beds, shrubs or trees that need attention and say whether you want a one-off visit or ongoing care.', 'اذكر العشب أو الأحواض أو الشجيرات أو الأشجار التي تحتاج إلى عناية، وما إذا كنت تريد زيارة واحدة أم عناية مستمرة.'),
    faq: [pair('Does maintenance include lawn mowing?', 'هل تشمل الصيانة قص العشب؟'), pair('Yes. Lawn mowing and grass trimming are part of weekly and monthly maintenance.', 'نعم، يشمل ذلك قص العشب وتشذيبه ضمن الصيانة الأسبوعية والشهرية.')],
  },
  'grass-plantation': {
    suitable: pair('For a new lawn, a patchy or worn lawn that needs renovating, or grass that needs better nutrition.', 'لعشب جديد، أو عشب متضرر يحتاج إلى تجديد، أو عشب يحتاج إلى تغذية أفضل.'),
    prepare: pair('Note the approximate lawn area, how it is accessed and the current condition of the grass or soil. Photos help.', 'اذكر المساحة التقريبية للعشب وطريقة الوصول إليه والحالة الحالية للعشب أو التربة. وتفيد الصور.'),
    faq: [pair('Do you maintain the lawn after planting?', 'هل تعتنون بالعشب بعد الزراعة؟'), pair('Yes. Lawn maintenance and restoration are part of the service.', 'نعم، صيانة العشب وإعادة تأهيله جزء من الخدمة.')],
  },
  'date-palm-tree-care': {
    suitable: pair('For villas, compounds and businesses with date palms or landscape trees that need cleaning, trimming or shaping.', 'للفلل والمجمعات والمنشآت التي فيها نخيل أو أشجار تحتاج إلى تنظيف أو تشذيب أو تشكيل.'),
    prepare: pair('Note how many palms or trees you have, their type if known, and what needs doing. Photos help us plan the visit.', 'اذكر عدد النخيل أو الأشجار ونوعها إن عرفته وما يلزم عمله. وتفيد الصور في تخطيط الزيارة.'),
    faq: [pair('Do you work on Washingtonia palms?', 'هل تعتنون بنخيل الواشنطونيا؟'), pair('Yes. Washingtonia palm maintenance is part of our palm and tree care.', 'نعم، صيانة نخيل الواشنطونيا جزء من خدمات العناية بالنخيل والأشجار.')],
  },
  'irrigation-systems': {
    suitable: pair('For new gardens that need watering set up, or existing systems that need inspection, repair or new components.', 'للحدائق الجديدة التي تحتاج إلى تجهيز الري، أو الأنظمة القائمة التي تحتاج إلى فحص أو إصلاح أو مكونات جديدة.'),
    prepare: pair('Note the system type if you have one, which areas are too dry or too wet, and the approximate size of the garden.', 'اذكر نوع النظام إن وجد، والمناطق الجافة أو الرطبة أكثر من اللازم، والمساحة التقريبية للحديقة.'),
    faq: [pair('Can you repair my existing irrigation system?', 'هل يمكنكم إصلاح نظام الري الحالي؟'), pair('Yes. We offer irrigation inspection and repair.', 'نعم، نقدم فحص أنظمة الري وإصلاحها.')],
  },
  'indoor-plants': {
    suitable: pair('For homes, offices and commercial spaces that want indoor plants selected, installed and looked after.', 'للمنازل والمكاتب والمساحات التجارية التي تريد اختيار نباتات داخلية وتركيبها والعناية بها.'),
    prepare: pair('Tell us about the space, how much light it gets and the look you want. Photos of the room help.', 'أخبرنا عن المكان ومقدار الضوء الذي يصله والشكل الذي تريده. وتفيد صور الغرفة.'),
    faq: [pair('Do you maintain indoor plants after installation?', 'هل تعتنون بالنباتات الداخلية بعد التركيب؟'), pair('Yes. Indoor plant maintenance is part of the service.', 'نعم، صيانة النباتات الداخلية جزء من الخدمة.')],
  },
  'soil-fertilization': {
    suitable: pair('For lawns and plants that need better soil, organic manure or a regular nutrition routine.', 'للعشب والنباتات التي تحتاج إلى تربة أفضل أو سماد عضوي أو برنامج تغذية منتظم.'),
    prepare: pair('Note what is growing, where, and any problems you have noticed such as weak growth or poor soil. Photos help.', 'اذكر ما هو مزروع ومكانه وأي مشكلات لاحظتها مثل ضعف النمو أو سوء التربة. وتفيد الصور.'),
    faq: [pair('Do you supply the soil and fertilizer?', 'هل توفّرون التربة والسماد؟'), pair('Our service includes soil improvement, organic manure, German potting soil and NPK fertilizer application.', 'تشمل خدمتنا تحسين التربة والسماد العضوي وتربة الزراعة الألمانية وإضافة سماد NPK.')],
  },
  'grass-cutting': {
    suitable: pair('For villas, compounds and businesses with an existing lawn that needs regular mowing and tidy edges.', 'للفلل والمجمعات والمنشآت التي لديها مسطح عشبي قائم ويحتاج إلى قص منتظم وحواف مرتبة.'),
    prepare: pair('Note the approximate lawn area, the type of grass if you know it, and how often you would like it cut. Photos help.', 'اذكر مساحة العشب التقريبية ونوعه إن كنت تعرفه، وعدد مرات القص التي تفضّلها. وتفيد الصور.'),
    faq: [pair('Does grass cutting include the planted beds?', 'هل يشمل قص العشب العناية بالأحواض المزروعة؟'), pair('Grass cutting focuses on the turf and its edges. If beds or shrubs also need attention, look at garden maintenance.', 'يركّز قص العشب على المسطح العشبي وحوافه. وإذا كانت الأحواض أو الشجيرات تحتاج إلى عناية أيضاً، فاطّلع على خدمة صيانة الحدائق.')],
  },
  'garden-cleaning': {
    suitable: pair('For overgrown or neglected gardens, new properties, or seasonal preparation before planting.', 'للحدائق المهملة أو المتروكة، أو العقارات الجديدة، أو التجهيز الموسمي قبل الزراعة.'),
    prepare: pair('Send photos of the garden as it is now and tell us what you would like cleared, dug or prepared.', 'أرسل صوراً للحديقة بحالتها الحالية وأخبرنا بما تريد إزالته أو حفره أو تجهيزه.'),
    faq: [pair('Can you restore an overgrown garden?', 'هل يمكنكم إعادة تأهيل حديقة مهملة؟'), pair('Yes. Overgrown garden restoration and removal of dry plants and unwanted growth are part of this service.', 'نعم، إعادة تأهيل الحدائق المهملة وإزالة النباتات الجافة والنموات غير المرغوبة جزء من هذه الخدمة.')],
  },
} satisfies Record<ServiceSlug, { suitable: Localized; prepare: Localized; faq: readonly [Localized, Localized] }>;

export const journey = {
  choose: pair('What does your space need?', 'ماذا تحتاج مساحتك؟'),
  suitable: pair('When this service makes sense', 'متى تناسبك هذه الخدمة؟'),
  prepare: pair('Before you inquire', 'قبل الاستفسار'),
  commonDetails: pair('Include the property type, your area in Qatar and any preferred timing. Approximate measurements are enough if you have them.', 'اذكر نوع العقار ومنطقتك في قطر والموعد الذي تفضّله إن وجد. تكفي القياسات التقريبية إذا كانت متاحة.'),
  next: pair('Message us on WhatsApp or call to arrange a free inspection and quotation.', 'راسلنا عبر واتساب أو اتصل بنا لترتيب معاينة وعرض سعر مجانيين.'),
  challenge: pair('The challenge', 'التحدي'),
  approach: pair('The proposed approach', 'النهج المقترح'),
  outcome: pair('What the space could become', 'كيف يمكن أن تصبح المساحة'),
  caseStudy: pair('Project overview', 'نظرة عامة على المشروع'),
  work: pair('The work carried out', 'الأعمال المنفّذة'),
  result: pair('The result', 'النتيجة'),
  concept: pair('View garden concept', 'شاهد التصور'),
  moreConcepts: pair('Explore another concept', 'استكشف تصوراً آخر'),
  startTitle: pair('How to get started', 'كيف تبدأ؟'),
  startIntro: pair('A few details help us prepare your free inspection and quotation.', 'بعض التفاصيل تساعدنا على تجهيز المعاينة وعرض السعر المجانيين.'),
  startSteps: [
    {
      title: pair('Tell us about your space', 'أخبرنا عن مساحتك'),
      copy: pair('Note the property type, your area in Qatar and approximate size. Set aside photos if you have them.', 'اذكر نوع العقار ومنطقتك في قطر ومساحته التقريبية، وجهّز صوراً إن كانت متاحة.'),
    },
    {
      title: pair('Describe what you need', 'صف ما تحتاجه'),
      copy: pair('One-time project or regular maintenance? Say what you would like done and when.', 'مشروع لمرة واحدة أم صيانة دورية؟ أخبرنا بما تريد تنفيذه وموعده.'),
    },
    {
      title: pair('Book your free inspection', 'احجز معاينتك المجانية'),
      copy: pair('We inspect the garden and prepare a clear quotation based on your requirements.', 'نعاين الحديقة ونعدّ عرض سعر واضحاً بحسب متطلباتك.'),
    },
  ],
  formGuide: pair('Tell us where you are and what the space needs. Add the property type, approximate size and preferred timing if you know them.', 'أخبرنا بموقعك وما تحتاجه مساحتك. وأضف نوع العقار والمساحة التقريبية والموعد المفضل إن كنت تعرفها.'),
} as const;