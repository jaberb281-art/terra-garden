import { pair, type Localized } from './site';
import type { ServiceSlug } from './catalog';

export const servicePaths = [
  {
    id: 'maintain',
    choice: pair('Maintain my existing garden', 'العناية بحديقتي الحالية'),
    title: pair('Care for an existing garden', 'العناية بحديقة قائمة'),
    description: pair('Choose grass cutting for the lawn and its edges. Choose garden maintenance when beds, shrubs or general tidying also need attention.', 'اختر قص العشب للعناية بالمسطح العشبي وحوافه. واختر صيانة الحدائق إذا كانت الأحواض أو الشجيرات أو الحديقة عموماً بحاجة إلى عناية.'),
    services: ['grass-cutting', 'garden-maintenance'],
  },
  {
    id: 'improve',
    choice: pair('Improve my outdoor space', 'تحسين مساحتي الخارجية'),
    title: pair('Improve an outdoor space', 'تحسين المساحة الخارجية'),
    description: pair('Choose landscaping to change how the space is laid out or used. For new planting or a watering issue within the existing layout, start with planting and irrigation.', 'اختر تنسيق المساحات الخارجية لتغيير تخطيط المكان أو طريقة استخدامه. ولإضافة نباتات أو معالجة مشكلة في الري ضمن التخطيط الحالي، ابدأ بخدمة الزراعة والري.'),
    services: ['landscaping', 'plant-and-irrigation'],
  },
] as const satisfies readonly {
  id: string;
  choice: Localized;
  title: Localized;
  description: Localized;
  services: readonly ServiceSlug[];
}[];

export const serviceGuidance = {
  'grass-cutting': {
    suitable: pair('For an established lawn that needs a cut, tidier edges or a mowing routine that fits its growth.', 'للمسطحات العشبية القائمة التي تحتاج إلى قص أو ترتيب للحواف أو جدول قص يناسب نموها.'),
    prepare: pair('Note the approximate lawn area, how it is accessed and when it was last cut. A photo of the grass and its edges can show its current condition.', 'اذكر المساحة التقريبية للعشب وطريقة الوصول إليه وموعد آخر قص. ويمكن لصورة العشب وحوافه أن توضح حالته الحالية.'),
    faq: [pair('Does grass cutting include the planted beds?', 'هل يشمل قص العشب العناية بالأحواض المزروعة؟'), pair('Grass cutting focuses on the turf and its edges. If beds or shrubs also need attention, look at garden maintenance.', 'يركّز قص العشب على المسطح العشبي وحوافه. وإذا كانت الأحواض أو الشجيرات تحتاج إلى عناية أيضاً، فاطّلع على خدمة صيانة الحدائق.')],
  },
  'garden-maintenance': {
    suitable: pair('For planted gardens with overgrown shrubs, weedy beds or outdoor areas that need seasonal tidying.', 'للحدائق المزروعة التي تحتاج شجيراتها إلى تقليم أو أحواضها إلى إزالة الأعشاب الدخيلة أو مساحاتها إلى ترتيب موسمي.'),
    prepare: pair('List the beds, shrubs or paths that need attention. Note whether you have a one-off tidy-up in mind or want to discuss ongoing care.', 'حدّد الأحواض أو الشجيرات أو الممرات التي تحتاج إلى عناية، واذكر ما إذا كنت تفكر في زيارة واحدة للترتيب أو ترغب في مناقشة العناية الدورية.'),
    faq: [pair('What if some plants look unhealthy?', 'ماذا لو بدت بعض النباتات غير سليمة؟'), pair('Note which plants are affected, when the signs appeared and whether watering changed. Photos can help describe what you see.', 'اذكر النباتات المتأثرة ومتى ظهرت العلامات وما إذا تغيّر الري. وقد تساعد الصور على وصف ما تلاحظه.')],
  },
  landscaping: {
    suitable: pair('For a courtyard, garden or outdoor area whose layout no longer fits how you want to use it.', 'للأفنية والحدائق والمساحات الخارجية التي لم يعد تخطيطها يلائم طريقة استخدامها.'),
    prepare: pair('Set aside photos from a few angles, approximate dimensions, and a short list of what you want to keep, change or add.', 'جهّز صوراً من عدة زوايا وأبعاداً تقريبية وقائمة قصيرة بما تريد الإبقاء عليه أو تغييره أو إضافته.'),
    faq: [pair('What if I only want to change one area?', 'ماذا لو أردت تغيير جزء واحد فقط؟'), pair('Identify the area you want to change and how it connects to the rest of the property. Note any paths, trees or seating you want to keep.', 'حدّد الجزء الذي تريد تغييره وكيف يتصل ببقية العقار. واذكر الممرات أو الأشجار أو أماكن الجلوس التي تريد الإبقاء عليها.')],
  },
  'plant-and-irrigation': {
    suitable: pair('For empty or struggling beds, plants that need replacing, or areas that get too much or too little water.', 'للأحواض الفارغة أو التي تعاني فيها النباتات، وللنباتات التي تحتاج إلى استبدال، وللمناطق التي يصلها ماء أكثر أو أقل من حاجتها.'),
    prepare: pair('Note which areas get direct sun, where plants struggle, and how you water them now. Include the type of irrigation system if known.', 'اذكر المناطق التي تصلها الشمس مباشرة، وأين تعاني النباتات، وكيف ترويها حالياً. واذكر نوع نظام الري إن كنت تعرفه.'),
    faq: [pair('What if only one part of my garden is dry?', 'ماذا لو كان جزء واحد فقط من حديقتي جافاً؟'), pair('Mark the dry area, note when it receives sun, and check whether nearby plants on the same watering schedule are also affected.', 'حدّد الجزء الجاف ووقت تعرّضه للشمس، ولاحظ ما إذا كانت النباتات المجاورة التي تُروى وفق الجدول نفسه متأثرة أيضاً.')],
  },
} satisfies Record<ServiceSlug, { suitable: Localized; prepare: Localized; faq: readonly [Localized, Localized] }>;

export const journey = {
  choose: pair('What does your space need?', 'ماذا تحتاج مساحتك؟'),
  suitable: pair('When this service makes sense', 'متى تناسبك هذه الخدمة؟'),
  prepare: pair('Before you inquire', 'قبل الاستفسار'),
  commonDetails: pair('Include the property type, general location in Qatar and any preferred timing. Approximate measurements are enough if you have them.', 'اذكر نوع العقار وموقعه العام في قطر والموعد الذي تفضّله إن وجد. تكفي القياسات التقريبية إذا كانت متاحة.'),
  next: pair('Confirm the scope and next steps with TERRA once an inquiry channel is available.', 'عندما تتاح وسيلة للتواصل، ناقش نطاق العمل والخطوات التالية مع تيرا.'),
  challenge: pair('The challenge', 'التحدي'),
  approach: pair('The proposed approach', 'النهج المقترح'),
  outcome: pair('What the space could become', 'كيف يمكن أن تصبح المساحة'),
  caseStudy: pair('Project overview', 'نظرة عامة على المشروع'),
  work: pair('The work carried out', 'الأعمال المنفّذة'),
  result: pair('The result', 'النتيجة'),
  concept: pair('View garden concept', 'شاهد التصور'),
  moreConcepts: pair('Explore another concept', 'استكشف تصوراً آخر'),
  startTitle: pair('How to get started', 'كيف تبدأ؟'),
  startIntro: pair('A few details help you explain what you need.', 'بعض التفاصيل تساعدك على توضيح ما تحتاجه.'),
  startSteps: [
    {
      title: pair('Tell us about your space', 'أخبرنا عن مساحتك'),
      copy: pair('Note the property type, general location in Qatar and approximate size. Set aside photos if you have them.', 'اذكر نوع العقار وموقعه العام في قطر ومساحته التقريبية، وجهّز صوراً إن كانت متاحة.'),
    },
    {
      title: pair('Describe what you need', 'صف ما تحتاجه'),
      copy: pair('Decide whether you need routine care, planting and watering help, or a wider landscaping change.', 'حدّد ما إذا كنت تحتاج إلى عناية دورية أو مساعدة في الزراعة والري أو تغيير أوسع في تنسيق المساحة.'),
    },
    {
      title: pair('Confirm the next steps', 'اتفق على الخطوات التالية'),
      copy: pair('When an inquiry channel is available, discuss what the work may involve and which arrangements are suitable.', 'عندما تتاح وسيلة للتواصل، ناقش ما قد يشمله العمل والترتيبات المناسبة.'),
    },
  ],
  formGuide: pair('Use sample details to practise. For a future inquiry, prepare your name and contact details, property type, the service you need, and your general location in Qatar. Add a description of the work, approximate size and preferred timing if known.', 'استخدم بيانات افتراضية للتجربة. وللاستفسار مستقبلاً، جهّز اسمك وبيانات التواصل ونوع العقار والخدمة المطلوبة وموقع العقار العام في قطر. أضف وصف العمل والمساحة التقريبية والموعد المفضّل إن كان معروفاً.'),
  formStatus: pair('This form checks your entries in the browser only. It does not send or store an inquiry.', 'يتحقق هذا النموذج من المدخلات في المتصفح فقط، ولا يرسل الاستفسار أو يحفظه.'),
} as const;
