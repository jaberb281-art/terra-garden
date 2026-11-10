import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { supabaseConfig } from '@/lib/cms/env';

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const config = supabaseConfig();
  if (config) {
    const secure = request.nextUrl.protocol === 'https:';
    const supabase = createServerClient(config.url, config.key, {
      cookieOptions: { httpOnly: true, sameSite: 'lax', secure },
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (entries, headers) => {
          for (const { name, value } of entries) request.cookies.set(name, value);
          response = NextResponse.next({ request });
          for (const { name, value, options } of entries) {
            response.cookies.set(name, value, { ...options, httpOnly: true, secure });
          }
          for (const [name, value] of Object.entries(headers ?? {})) response.headers.set(name, value);
        },
      },
    });
    await supabase.auth.getClaims();
  }
  response.headers.set('Cache-Control', 'private, no-store');
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return response;
}

export const config = { matcher: ['/admin/:path*'] };
