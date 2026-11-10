import { pair, type Locale } from './site';

export const whatsappCopy = {
  chat: pair('Chat on WhatsApp', 'تواصل عبر واتساب'),
  quote: pair('WhatsApp quote', 'عرض سعر عبر واتساب'),
  hero: pair('Get a quote on WhatsApp', 'اطلب عرض سعر عبر واتساب'),
  service: pair('Ask about this service', 'استفسر عن هذه الخدمة'),
  project: pair('Start a similar project', 'ابدأ مشروعاً مماثلاً'),
  product: pair('Ask on WhatsApp', 'استفسر عبر واتساب'),
  unavailable: pair('WhatsApp unavailable', 'واتساب غير متاح'),
  unavailableDetail: pair('WhatsApp is unavailable until a verified number is configured.', 'يتاح التواصل عبر واتساب بعد إضافة رقم معتمد.'),
  footer: pair('Tell us about your garden, landscaping plans, or the care your outdoor space needs.', 'أخبرنا عن حديقتك أو خططك لتنسيقها أو العناية التي تحتاجها.'),
  contact: pair('Tell us where in Qatar you are and what you have in mind. WhatsApp will open with a message you can edit before sending.', 'أخبرنا عن موقعك في قطر وما تفكر فيه. سيفتح واتساب برسالة يمكنك تعديلها قبل الإرسال.'),
  form: pair('Try the quote form', 'جرّب نموذج عرض السعر'),
  dismiss: pair('Dismiss WhatsApp reminder', 'أخفِ تذكير واتساب'),
  reminders: [
    pair('Need garden care?', 'تحتاج إلى العناية بحديقتك؟'),
    pair('Get a quote', 'اطلب عرض سعر'),
    pair('Chat with our team', 'تواصل مع فريقنا'),
  ],
};

export type Inquiry = { kind: 'service' | 'project' | 'product'; name: string };

export function createWhatsAppLink(number: string | undefined, message: string) {
  if (!number || !/^[1-9][0-9]{7,14}$/.test(number)) return undefined;
  return 'https://wa.me/' + number + '?text=' + encodeURIComponent(message);
}

export const whatsappNumber = process.env.TERRA_WHATSAPP_NUMBER?.trim();

export function inquiryLink(locale: Locale, inquiry?: Inquiry) {
  const ar = locale === 'ar';
  let message = ar
    ? 'مرحباً، أود الحصول على عرض سعر لخدمات العناية بالحدائق أو تنسيق المساحات الخارجية في قطر.'
    : 'Hello, I would like a quote for gardening or landscaping services in Qatar.';

  if (inquiry?.kind === 'service') {
    message = ar ? 'مرحباً، أود الاستفسار عن خدمة ' + inquiry.name + '.' : 'Hello, I would like to ask about ' + inquiry.name + '.';
  }
  if (inquiry?.kind === 'project') {
    message = ar ? 'مرحباً، أنا مهتم بمشروع مماثل لتصور «' + inquiry.name + '».' : 'Hello, I am interested in a project similar to ' + inquiry.name + '.';
  }
  if (inquiry?.kind === 'product') {
    message = ar ? 'مرحباً، أود الاستفسار عن ' + inquiry.name + '.' : 'Hello, I would like to inquire about ' + inquiry.name + '.';
  }
  return createWhatsAppLink(whatsappNumber, message);
}
