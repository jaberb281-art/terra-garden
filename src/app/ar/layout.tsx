import type { ReactNode } from 'react';
import { LocaleLayout } from '@/components/locale-layout';
export default function Layout({children}: {children:ReactNode}) {
  return <LocaleLayout locale="ar">{children}</LocaleLayout>;
}
