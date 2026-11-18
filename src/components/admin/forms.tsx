'use client';

import { useActionState, useEffect, useRef, useState, useTransition, type FormEvent, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { ActionResult } from '@/app/admin/actions';
import type { ImageRole, ServiceRecord } from '@/lib/cms/records';

type Action = (state: ActionResult, data: FormData) => Promise<ActionResult>;

export function AdminForm({ action, children, label, danger = false, protect = false, className }: {
  action: Action; children: ReactNode; label: string; danger?: boolean; protect?: boolean; className?: string;
}) {
  const [state, dispatch, pending] = useActionState(action, {});
  const [, startTransition] = useTransition();
  const [dirty, setDirty] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!protect || !dirty || pending) return;
    const beforeUnload = (event: BeforeUnloadEvent) => { event.preventDefault(); };
    const beforeLink = (event: MouseEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
      const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
      if (!link || link.getAttribute('target') === '_blank') return;
      if (!window.confirm('Leave without saving your changes?')) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    const beforeOtherSubmit = (event: SubmitEvent) => {
      if (event.target !== formRef.current && !window.confirm('Continue without saving your changes?')) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    window.addEventListener('beforeunload', beforeUnload);
    document.addEventListener('click', beforeLink, true);
    document.addEventListener('submit', beforeOtherSubmit, true);
    return () => {
      window.removeEventListener('beforeunload', beforeUnload);
      document.removeEventListener('click', beforeLink, true);
      document.removeEventListener('submit', beforeOtherSubmit, true);
    };
  }, [dirty, pending, protect]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const data = new FormData(event.currentTarget);
    startTransition(() => dispatch(data));
  }

  return (
    <form ref={formRef} action={dispatch} onSubmit={submit} onInput={() => protect && setDirty(true)} onChange={() => protect && setDirty(true)} className={className ?? 'admin-form'}>
      <fieldset disabled={pending}>
        {children}
        {state.error && <p role="alert" className="admin-error">{state.error}</p>}
        <button type="submit" className={'button ' + (danger ? 'admin-danger' : 'primary')} disabled={pending}>
          {pending ? 'Working…' : label}
        </button>
      </fieldset>
    </form>
  );
}

export function FaqEditor({ faqs }: { faqs: ServiceRecord['service_faqs'] }) {
  const [rows, setRows] = useState(() => [...faqs].sort((a, b) => a.sort_order - b.sort_order));
  const blank = { en: '', ar: '' };
  const id = useRef(0);
  return (
    <div className="admin-stack">
      <input type="hidden" name="faq_count" value={rows.length} />
      {rows.map((row, index) => (
        <section key={row.id} className="admin-inset">
          <div className="admin-row">
            <h3>FAQ {index + 1}</h3>
            <button type="button" className="button ghost" onClick={event => {
              // Keep current edits when removing a row, and mark the parent form dirty.
              const form = event.currentTarget.form;
              if (!form) return;
              const data = new FormData(form);
              const updated = rows.map((item, position) => ({
                ...item,
                question: { en: String(data.get('question_' + position + '_en') ?? ''), ar: String(data.get('question_' + position + '_ar') ?? '') },
                answer: { en: String(data.get('answer_' + position + '_en') ?? ''), ar: String(data.get('answer_' + position + '_ar') ?? '') },
              }));
              setRows(updated.filter(item => item.id !== row.id));
              form.dispatchEvent(new Event('input', { bubbles: true }));
            }}>Remove FAQ {index + 1}</button>
          </div>
          <div className="admin-fields">
            {(['en', 'ar'] as const).map(locale => (
              <div key={locale}>
                <label>Question · {locale.toUpperCase()} <input name={'question_' + index + '_' + locale} defaultValue={row.question[locale]} required maxLength={200} lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} /></label>
                <label>Answer · {locale.toUpperCase()} <textarea name={'answer_' + index + '_' + locale} defaultValue={row.answer[locale]} required maxLength={1200} rows={3} lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} /></label>
              </div>
            ))}
          </div>
        </section>
      ))}
      <button type="button" className="button ghost" disabled={rows.length >= 12} onClick={event => {
        const key = 'new-' + ++id.current;
        setRows(current => [...current, { id: key, question: blank, answer: blank, sort_order: current.length }]);
        event.currentTarget.form?.dispatchEvent(new Event('input', { bubbles: true }));
      }}>Add FAQ</button>
    </div>
  );
}

export function ImageUpload({ projectId, role, order, disabled }: {
  projectId: string; role: ImageRole; order: number; disabled: boolean;
}) {
  const router = useRouter();
  const [state, setState] = useState({ running: false, progress: 0, message: '', error: false });
  const xhr = useRef<XMLHttpRequest | null>(null);
  useEffect(() => () => xhr.current?.abort(), []);

  function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state.running || disabled) return;
    const form = event.currentTarget;
    const body = new FormData(form);
    const file = body.get('file');
    if (!(file instanceof File) || !file.size || file.size > 4 * 1024 * 1024 || !['image/jpeg','image/png','image/webp'].includes(file.type)) {
      setState({ running: false, progress: 0, message: 'Choose a JPEG, PNG, or WebP file up to 4 MB.', error: true });
      return;
    }
    const request = new XMLHttpRequest();
    xhr.current = request;
    request.open('POST', '/admin/projects/' + projectId + '/upload');
    request.responseType = 'json';
    request.timeout = 45000;
    setState({ running: true, progress: 0, message: '', error: false });
    request.upload.onprogress = progress => {
      if (progress.lengthComputable) setState(previous => ({ ...previous, progress: Math.round(progress.loaded / progress.total * 100) }));
    };
    const failed = () => setState({ running: false, progress: 0, message: 'The upload did not finish. Check the gallery before retrying.', error: true });
    request.onerror = failed;
    request.ontimeout = failed;
    request.onload = () => {
      const ok = request.status === 201;
      const message = request.response?.message ?? (ok ? 'Photo saved.' : 'The photo could not be saved.');
      setState({ running: false, progress: 0, message, error: !ok });
      if (ok) { form.reset(); router.refresh(); }
    };
    request.send(body);
  }

  return (
    <form className="admin-inset admin-form" method="post" encType="multipart/form-data" action={'/admin/projects/' + projectId + '/upload'} onSubmit={upload}>
      <fieldset disabled={disabled || state.running}>
        <legend>{role === 'gallery' ? 'Add a gallery photograph' : 'Upload or replace ' + role}</legend>
        <input type="hidden" name="role" value={role} />
        <input type="hidden" name="sort_order" value={order} />
        <label>Photograph <input type="file" name="file" accept="image/jpeg,image/png,image/webp" required /></label>
        <div className="admin-fields">
          {(['en','ar'] as const).map(locale => (
            <div key={locale}>
              <label>Alt text · {locale.toUpperCase()} <input name={'alt_' + locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} lang={locale} maxLength={240} required /></label>
              <label>Caption · {locale.toUpperCase()} (optional) <input name={'caption_' + locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} lang={locale} maxLength={300} /></label>
            </div>
          ))}
        </div>
        <button type="submit" className="button ghost">Upload photograph</button>
      </fieldset>
      {state.running && <div role="status"><progress max={100} value={state.progress} aria-label="Upload progress" /><p>{state.progress === 100 ? 'Validating and attaching the photograph…' : state.progress + '% uploaded'}</p></div>}
      {state.message && <p role={state.error ? 'alert' : 'status'} className={state.error ? 'admin-error' : 'admin-notice'}>{state.message}</p>}
    </form>
  );
}
