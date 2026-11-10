import type { Localized } from '@/content/site';

export function BilingualField({ label, name, max, value, rows, required }: {
  label: string; name: string; max: number; value?: Localized; rows?: number; required?: boolean;
}) {
  return (
    <div className="admin-fields">
      {(['en', 'ar'] as const).map(locale => {
        const props = {
          name: name + '_' + locale, defaultValue: value?.[locale], maxLength: max,
          required, lang: locale, dir: locale === 'ar' ? 'rtl' : 'ltr',
        };
        return (
          <label key={locale}>
            {label} · {locale === 'en' ? 'English' : 'Arabic'}
            {rows ? <textarea {...props} rows={rows} /> : <input {...props} />}
          </label>
        );
      })}
    </div>
  );
}

export function AdminNotice({ message }: { message?: string }) {
  return message ? <p role="status" className="admin-notice">{message}</p> : null;
}

export function AdminDataError() {
  return <p role="alert" className="admin-error">CMS data could not be loaded. Check the dedicated Supabase project, migrations and connection, then reload.</p>;
}
