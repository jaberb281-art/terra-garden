import { NextResponse, type NextRequest } from 'next/server';
import { isLocale } from '@/content/site';

/** Remember an explicit language choice only at the unlocalized entry URL. */
export function GET(request: NextRequest) {
  const preference = request.cookies.get('ab-gardening-locale')?.value ?? '';
  const locale = isLocale(preference) ? preference : 'en';
  const destination = new URL(request.url);
  destination.pathname = '/' + locale;
  return NextResponse.redirect(destination, {
    status: 307,
    headers: { 'Cache-Control': 'private, no-store', Vary: 'Cookie' },
  });
}
