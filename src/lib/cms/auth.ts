import 'server-only';

import { createServerClient } from '@supabase/ssr';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { supabaseConfig } from './env';

export async function sessionClient() {
  const config = supabaseConfig();
  if (!config) return null;
  const [jar, requestHeaders] = await Promise.all([cookies(), headers()]);
  const secure = requestHeaders.get('x-forwarded-proto') === 'https';
  return createServerClient(config.url, config.key, {
    cookieOptions: { httpOnly: true, sameSite: 'lax', secure },
    cookies: {
      getAll: () => jar.getAll(),
      setAll: entries => {
        try {
          for (const { name, value, options } of entries) jar.set(name, value, { ...options, httpOnly: true, secure });
        } catch {
          // Server Components cannot write cookies. The admin proxy refreshes them.
        }
      },
    },
  });
}

export async function adminIdentity() {
  const client = await sessionClient();
  if (!client) return null;
  const { data: { user }, error } = await client.auth.getUser();
  if (!user || error) return null;
  const { data: profile } = await client.from('admin_profiles')
    .select('role, active').eq('user_id', user.id).eq('active', true).maybeSingle();
  if (!profile || !['owner', 'editor'].includes(profile.role)) return null;
  return { client, user, role: profile.role as 'owner' | 'editor' };
}

export async function requireAdmin() {
  const admin = await adminIdentity();
  if (!admin) redirect('/admin/login');
  return admin;
}
