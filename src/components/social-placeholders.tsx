import type { Locale } from '@/content/site';

const platforms = [
  { name: 'Instagram', artwork: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" /></> },
  { name: 'Facebook', artwork: <path d="M14 21v-8h3l.5-4H14V7c0-1 .4-2 2-2h2V1.5c-.7-.1-1.7-.2-3-.2-3 0-5 1.8-5 5V9H7v4h3v8" fill="currentColor" stroke="none" /> },
  { name: 'YouTube', artwork: <><rect x="2" y="5" width="20" height="14" rx="4" /><path d="m10 9 5 3-5 3Z" fill="currentColor" stroke="none" /></> },
];

/** Display-only placeholders until the business provides its profile URLs. */
export function SocialPlaceholders({ locale }: { locale: Locale }) {
  const soon = locale === 'ar' ? 'قريباً' : 'Coming soon';
  return <div className="footer-social">
    <div className="footer-social-heading"><span>{locale === 'ar' ? 'تابعنا' : 'Follow along'}</span><small>{soon}</small></div>
    <ul aria-label={locale === 'ar' ? 'حسابات التواصل الاجتماعي قريباً' : 'Social media profiles coming soon'}>
      {platforms.map(platform => <li key={platform.name}>
        <span className="footer-social-icon" title={platform.name + ' · ' + soon}>
          <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label={platform.name + ' · ' + soon}>{platform.artwork}</svg>
        </span>
      </li>)}
    </ul>
  </div>;
}
