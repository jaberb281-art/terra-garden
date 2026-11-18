import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AdminForm } from '@/components/admin/forms';
import { adminIdentity } from '@/lib/cms/auth';
import { supabaseConfig } from '@/lib/cms/env';
import { login } from '../actions';

export const dynamic = 'force-dynamic';

export default async function AdminLogin() {
  if (await adminIdentity()) redirect('/admin');
  return (
    <main className="admin-login">
      <section className="admin-panel admin-stack">
        <p className="eyebrow">TERRA · Garden &amp; Landscape</p>
        <h1>Admin sign-in</h1>
        <p className="admin-help">Use the account provisioned by the site owner.</p>
        {supabaseConfig() ? (
          <AdminForm action={login} label="Sign in">
            <label>Email <input type="email" name="email" autoComplete="username" maxLength={254} required /></label>
            <label>Password <input type="password" name="password" autoComplete="current-password" maxLength={1024} required /></label>
          </AdminForm>
        ) : <p role="status" className="admin-notice">CMS setup is pending. Configure the dedicated Supabase project and initial administrator to sign in.</p>}
        <Link className="text-link" href="/en">Return to TERRA</Link>
      </section>
    </main>
  );
}
