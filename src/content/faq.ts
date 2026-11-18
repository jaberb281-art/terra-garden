import { pair, type Localized } from './site';

export const faqCopy = {
  tag: pair('Questions', 'أسئلة'),
  title: pair('Frequently asked questions', 'الأسئلة الشائعة'),
};

export const faqs: readonly (readonly [Localized, Localized])[] = [
  [pair('Do you provide gardening services throughout Qatar?', 'هل تقدمون خدمات البستنة في أنحاء قطر؟'),
   pair('Yes. We provide gardening and landscaping services throughout Doha and surrounding areas in Qatar.', 'نعم، نقدم خدمات البستنة وتنسيق الحدائق في الدوحة والمناطق المحيطة بها في قطر.')],
  [pair('Do you offer monthly garden maintenance?', 'هل تقدمون صيانة شهرية للحدائق؟'),
   pair('Yes. We provide flexible weekly and monthly garden maintenance arrangements for residential and commercial properties.', 'نعم، نقدم ترتيبات مرنة للصيانة الأسبوعية والشهرية للعقارات السكنية والتجارية.')],
  [pair('Can you design and develop a new villa garden?', 'هل يمكنكم تصميم وتنفيذ حديقة فيلا جديدة؟'),
   pair('Yes. We provide garden planning, landscaping, soil preparation, plantation, irrigation and decorative arrangements.', 'نعم، نقدم تخطيط الحدائق وتنسيقها وتجهيز التربة والزراعة والري والتنسيقات الزخرفية.')],
  [pair('Do you install automatic irrigation systems?', 'هل تركّبون أنظمة ري أوتوماتيكية؟'),
   pair('Yes. We install and maintain automatic irrigation systems, drip irrigation, sprinklers, timers and related components.', 'نعم، نركّب أنظمة الري الأوتوماتيكي والتنقيط والرشاشات والمؤقتات والمكونات المرتبطة بها ونتولى صيانتها.')],
  [pair('Do you provide indoor plant installation?', 'هل تقدمون تركيب النباتات الداخلية؟'),
   pair('Yes. We supply and install suitable indoor plants and decorative arrangements for homes, offices and commercial spaces.', 'نعم، نوفّر النباتات الداخلية المناسبة والتنسيقات الزخرفية ونركّبها للمنازل والمكاتب والمساحات التجارية.')],
  [pair('Do you provide free garden inspections?', 'هل تقدمون معاينة مجانية للحدائق؟'),
   pair('Yes. Contact our team to arrange an initial garden inspection and quotation.', 'نعم، تواصل مع فريقنا لترتيب معاينة أولية للحديقة وتقديم عرض سعر.')],
  [pair('Can you handle one-day gardening projects?', 'هل تنفذون مشاريع بستنة ليوم واحد؟'),
   pair('Yes. We undertake both one-time gardening projects and long-term maintenance contracts, depending on the project requirements.', 'نعم، ننفذ مشاريع البستنة لمرة واحدة وعقود الصيانة طويلة الأمد بحسب متطلبات المشروع.')],
];
