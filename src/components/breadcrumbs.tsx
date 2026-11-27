import Link from 'next/link';
import { type Locale } from '@/content/site';
import type { Breadcrumb } from '@/content/structured-data';
import styles from './breadcrumbs.module.css';

export function Breadcrumbs({ locale, items }: { locale: Locale; items: Breadcrumb[] }) {
  if (!items.length) return null;
  return <nav className={styles.breadcrumbs} aria-label={locale === 'ar' ? 'مسار التنقل' : 'Breadcrumb'}>
    <ol className="shell">{items.map((item, index) => <li key={item.href}>
      {index > 0 && <span className={styles.separator} aria-hidden="true">/</span>}
      {index === items.length - 1 ? <span aria-current="page">{item.name}</span> : <Link href={item.href}>{item.name}</Link>}
    </li>)}</ol>
  </nav>;
}
