import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '@fontsource-variable/manrope';
import '@fontsource-variable/inter';
import '@fontsource/ibm-plex-sans-arabic/400.css';
import '@fontsource/ibm-plex-sans-arabic/600.css';
import '@fontsource/ibm-plex-sans-arabic/700.css';
import '../globals.css';
import './admin.css';

export const metadata: Metadata = { title: 'TERRA Admin', robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body className="admin-body">{children}</body></html>;
}
