import { AdminForm } from '@/components/admin/forms';
import { AdminNotice } from '@/components/admin/fields';
import { requireAdmin } from '@/lib/cms/auth';
import { cloudinaryConfig } from '@/lib/cms/env';
import { changePassword } from '../../actions';

export default async function Settings({ searchParams }: { searchParams: Promise<{ notice?: string; logout?: string }> }) {
  const { user, role } = await requireAdmin();
  const status = await searchParams;
  return (
    <div className="admin-stack">
      <header className="admin-page-header"><div><p className="eyebrow">Content workspace</p><h1>Settings</h1><p className="admin-help">Account details and CMS connection status.</p></div></header>
      <AdminNotice message={status.notice === 'password' ? 'Password updated.' : undefined} />
      {status.logout === 'failed' && <p role="alert" className="admin-error">Sign-out could not be confirmed. Please retry.</p>}
      <section className="admin-panel admin-stack">
        <h2>Account</h2>
        <dl><dt>Email</dt><dd>{user.email}</dd><dt>Role</dt><dd>{role}</dd></dl>
        <AdminForm action={changePassword} label="Update password">
          <label>New password <input name="password" type="password" autoComplete="new-password" required minLength={12} maxLength={128} /></label>
          <label>Confirm new password <input name="confirmation" type="password" autoComplete="new-password" required minLength={12} maxLength={128} /></label>
        </AdminForm>
      </section>
      <section className="admin-panel admin-stack">
        <h2>Connections</h2>
        <p>Supabase administrator session verified.</p>
        <p>{cloudinaryConfig() ? 'Cloudinary credentials are configured.' : 'Cloudinary is not configured.'}</p>
        <p className="admin-help">Public inquiry and WhatsApp settings are outside this workspace.</p>
      </section>
    </div>
  );
}
