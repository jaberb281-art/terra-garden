import type { ReactNode } from 'react';
import '@fontsource-variable/manrope';
import '@fontsource-variable/inter';
import '@fontsource/ibm-plex-sans-arabic/arabic-400.css';
import '@fontsource/ibm-plex-sans-arabic/arabic-600.css';
import '@fontsource/ibm-plex-sans-arabic/arabic-700.css';
import '@/app/globals.css';
import type { Locale } from '@/content/site';

export function LocaleLayout({children,locale}: {children:ReactNode;locale:Locale}) {
  return <html lang={locale} dir={locale==='ar'?'rtl':'ltr'}><body>{children}</body></html>;
}
