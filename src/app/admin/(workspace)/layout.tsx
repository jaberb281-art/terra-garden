import Link from 'next/link';
import type { ReactNode } from 'react';
import { requireAdmin } from '@/lib/cms/auth';
import { logout } from '../actions';

export const dynamic = 'force-dynamic';

export default async function Workspace({ children }: { children: ReactNode }) {
  await requireAdmin();
  return (
    <div className="admin-shell">
      <a className="skip" href="#admin-content">Skip to content</a>
      <aside className="admin-sidebar">
        <Link href="/admin" className="admin-brand"><strong>TERRA</strong><span>Content workspace</span></Link>
        <nav aria-label="Administration">
          <Link href="/admin">Overview</Link><Link href="/admin/projects">Projects</Link>
          <Link href="/admin/services">Services</Link><Link href="/admin/settings">Settings</Link>
        </nav>
        <form action={logout}><button className="button ghost" type="submit">Sign out</button></form>
      </aside>
      <main id="admin-content" className="admin-main" tabIndex={-1}>{children}</main>
    </div>
  );
}
