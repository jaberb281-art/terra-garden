import { pair, type Localized } from './site';

/** Single place for the client's contact details. Change here, it updates everywhere. */
export const business = {
  phoneDisplay: '+974 7028 0176',
  phoneTel: '+97470280176',
  whatsapp: '97439982513', // international digits, no + or spaces
  email: 'info.qatargardening@gmail.com',
  hours: undefined as Localized | undefined,
};

export const areas: readonly Localized[] = [
  pair('All of Doha', 'جميع مناطق الدوحة'),
  pair('West Bay', 'الخليج الغربي'),
  pair('Lusail', 'لوسيل'),
  pair('The Pearl-Qatar', 'اللؤلؤة قطر'),
  pair('Msheireb', 'مشيرب'),
  pair('Al Waab', 'الوعب'),
  pair('Al Rayyan', 'الريان'),
  pair('Ain Khalid', 'عين خالد'),
  pair('Al Wakrah', 'الوكرة'),
  pair('Al Duhail', 'الدحيل'),
  pair('Umm Salal', 'أم صلال'),
  pair('Al Thumama', 'الثمامة'),
  pair('Abu Hamour', 'أبو هامور'),
  pair('Muaither', 'المعيذر'),
  pair('Al Gharrafa', 'الغرافة'),
  pair('Al Kharaitiyat', 'الخرايطيات'),
  pair('Bani Hajer', 'بني هاجر'),
  pair('Al Dayeen', 'الدعاين'),
];

export const areasCopy = {
  tag: pair('Areas we serve', 'مناطق الخدمة'),
  title: pair('Landscaping & gardening across Qatar.', 'تنسيق وصيانة الحدائق في أنحاء قطر.'),
  note: pair('Contact us to confirm availability in your area.', 'تواصل معنا للتأكد من توفر الخدمة في منطقتك.'),
};