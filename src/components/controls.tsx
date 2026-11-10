'use client';
import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Menu, X, ZoomIn } from 'lucide-react';
import { categories, navigation, ui, type Locale } from '@/content/site';
import { services, type Project, type SiteService } from '@/content/catalog';
import { projectPhoto } from '@/content/project-media';
import { MediaImage } from './media-image';

export function MobileNav({ locale, path }: { locale: Locale; path: string }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const [open, setOpen] = useState(false);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      const details = ref.current;
      if (details && event.target instanceof Node && !details.contains(event.target)) details.open = false;
    };
    document.addEventListener('pointerdown', closeOutside);
    return () => document.removeEventListener('pointerdown', closeOutside);
  }, [open]);

  return (
    <details
      className="mobile-nav"
      ref={ref}
      onToggle={event => setOpen(event.currentTarget.open)}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false;
      }}
      onKeyDown={event => {
        if (event.key !== 'Escape' || !event.currentTarget.open) return;
        event.currentTarget.open = false;
        event.currentTarget.querySelector('summary')?.focus();
      }}
    >
      <summary aria-controls={id} aria-label={ui.openMenu[locale]}><Menu size={21} aria-hidden="true" /></summary>
      <nav id={id} aria-label={ui.mainNav[locale]}>
        {navigation.map(entry => (
          <Link
            key={entry.path}
            href={'/' + locale + entry.path}
            aria-current={path === entry.path ? 'page' : undefined}
            data-active={entry.path !== '' && path.startsWith(entry.path + '/') ? true : undefined}
            onClick={() => { if (ref.current) ref.current.open = false; }}
          >
            {entry.label[locale]}
          </Link>
        ))}
      </nav>
    </details>
  );
}

export function ProjectGrid({items, locale, filter=false}: {items: readonly Project[]; locale: Locale; filter?: boolean}) {
  const [category,setCategory] = useState('all');
  const shown = items.filter(p => category==='all' || p.category===category);
  const hasReal = items.some(project => !project.sample);
  const all = hasReal ? (locale === 'ar' ? 'كل المشاريع والتصورات' : 'All work and concepts') : ui.all[locale];
  return <>
    {filter && <div className="filters">
      <button type="button" aria-pressed={category==='all'} onClick={()=>setCategory('all')}>{all}</button>
      {categories.map(c => <button key={c.id} type="button" aria-pressed={category===c.id} onClick={()=>setCategory(c.id)}>{c.name[locale]}</button>)}
    </div>}
    {filter && <span className="sr-only" role="status">{locale==='ar' ? 'عدد النتائج: ' : 'Results shown: '}{shown.length}</span>}
    {shown.length ? <div className="grid three">
      {shown.map(p => <article className="project-card" key={p.slug}>
        <Link href={'/'+locale+'/projects/'+p.slug}>
          <div className="card-photo"><MediaImage src={projectPhoto(p, 'after').src} alt={p.afterAlt[locale]} fill sizes="(max-width: 620px) 94vw, (max-width: 950px) 46vw, 390px"/>{p.sample && <span className="photo-tag">{ui.sample[locale]}</span>}</div>
          <div className="project-body"><div><p className="eyebrow">{categories.find(c=>c.id===p.category)?.name[locale]}</p><h3>{p.title[locale]}</h3><p>{p.summary[locale]}</p></div><ArrowUpRight size={21} aria-hidden="true"/></div>
        </Link>
      </article>)}
    </div> : <p>{ui.empty[locale]}</p>}
  </>;
}

export function Gallery({project,locale}: {project:Project;locale:Locale}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [active, setActive] = useState(0);
  const id = useId();
  const images = [
    { ...projectPhoto(project, 'before'), name: ui.before[locale] },
    { ...projectPhoto(project, 'after'), name: ui.after[locale] },
    ...(project.media?.gallery ?? []).map(image => ({ ...image, name: image.caption?.[locale] || image.alt[locale] })),
  ];
  const selected = images[active] ?? images[0];
  return <div className="gallery">
    {images.map((im,i) => <button key={im.src} type="button" aria-label={ui.openPhoto[locale]+': '+im.name} onClick={e => {trigger.current=e.currentTarget;setActive(i);dialog.current?.showModal();}}><div className="card-photo"><MediaImage src={im.src} alt={im.alt[locale]} fill sizes="(max-width: 620px) 43vw, 330px"/><ZoomIn aria-hidden="true" className="zoom-icon"/></div><span>{im.name}</span></button>)}
    <dialog ref={dialog} aria-labelledby={id} onClose={()=>trigger.current?.focus()}>
      <div className="dialog-head"><h3 id={id}>{selected.name}{project.sample ? ' · '+ui.sample[locale] : ''}</h3><button type="button" aria-label={ui.close[locale]} onClick={()=>dialog.current?.close()}><X aria-hidden="true"/></button></div>
      <MediaImage src={selected.src} alt={selected.alt[locale]} width={selected.width} height={selected.height} sizes="(max-width: 620px) 90vw, 530px" />
      {selected.caption?.[locale] && selected.caption[locale] !== selected.name && <p>{selected.caption[locale]}</p>}
    </dialog>
  </div>;
}

const fields = {
  name:['Name (optional)','الاسم (اختياري)'], phone:['Phone (optional)','رقم الهاتف (اختياري)'], property:['Property type (optional)','نوع العقار (اختياري)'], service:['Service (optional)','الخدمة (اختياري)'], location:['Location in Qatar','الموقع في قطر'], size:['Property size (optional)','مساحة العقار (اختياري)'], date:['Preferred date (optional)','التاريخ المفضل (اختياري)'], message:['Describe the work','صف العمل المطلوب'],
} as const;
type Field = keyof typeof fields;
type Errors = Partial<Record<Field|'consent',string>>;
const requiredFields: readonly Field[] = ['location', 'message'];
const subscribeToHydration = () => () => {};
export function QuoteForm({locale, serviceItems = services}: {locale: Locale; serviceItems?: readonly SiteService[]}) {
  const [errors,setErrors] = useState<Errors>({});
  const [valid,setValid] = useState(false);
  const hydrated=useSyncExternalStore(subscribeToHydration,()=>true,()=>false);
  const ar=locale==='ar';
  const label=(field:Field)=>fields[field][ar?1:0];
  const required=ar?'هذا الحقل مطلوب.':'This field is required.';
  const submit=(e:FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    const form=e.currentTarget;
    const values=new FormData(form);
    const value=(field:Field)=>String(values.get(field)??'').trim();
    const next:Errors={};
    for(const key of requiredFields) if(!value(key)) next[key]=required;
    const digits=value('phone').replace(/[٠-٩]/g,c=>String(c.charCodeAt(0)-1632)).replace(/[۰-۹]/g,c=>String(c.charCodeAt(0)-1776));
    if(digits && (!/^\+?[\d\s().-]+$/.test(digits) || !/^\d{8,15}$/.test(digits.replace(/\D/g,'')))) next.phone=ar?'أدخل رقم هاتف صالحاً من ٨ إلى ١٥ رقماً.':'Enter a valid phone number with 8 to 15 digits.';
    if(!values.has('consent')) next.consent=ar?'يرجى تأكيد فهمك لطبيعة النموذج التجريبي.':'Please acknowledge that this is a demo.';
    setErrors(next);
    const first=Object.keys(next)[0];
    setValid(!first);
    if(first) (form.elements.namedItem(first) as HTMLElement|null)?.focus();
  };
  const attributes=(field:Field)=>({id:'quote-'+field,name:field,required:requiredFields.includes(field),'aria-invalid':!!errors[field],'aria-describedby':errors[field]?'error-'+field:undefined});
  const error=(field:Field|'consent')=>errors[field]&&<span className="field-error" id={'error-'+field} role="alert">{errors[field]}</span>;
  return <form className="quote-form" method="post" noValidate onSubmit={submit} onChange={()=>{if(valid)setValid(false);}}>
    <fieldset disabled={!hydrated}><div className="form-grid">
      <label htmlFor="quote-name">{label('name')}<input {...attributes('name')} autoComplete="name" maxLength={120}/>{error('name')}</label>
      <label htmlFor="quote-phone">{label('phone')}<input {...attributes('phone')} type="tel" autoComplete="tel" maxLength={28} dir="ltr"/>{error('phone')}</label>
      <label htmlFor="quote-property">{label('property')}<select {...attributes('property')} defaultValue=""><option value="">{ar?'اختر نوع العقار':'Select property type'}</option>{categories.map(c=><option key={c.id} value={c.id}>{c.title[locale]}</option>)}<option value="other">{ar?'أخرى':'Other'}</option></select>{error('property')}</label>
      <label htmlFor="quote-service">{label('service')}<select {...attributes('service')} defaultValue=""><option value="">{ar?'اختر الخدمة':'Select a service'}</option>{serviceItems.map(s=><option key={s.slug} value={s.slug}>{s.title[locale]}</option>)}<option value="other">{ar?'استفسار عام أو عن المستلزمات':'General or supplies inquiry'}</option></select>{error('service')}</label>
      <label htmlFor="quote-location">{label('location')}<input {...attributes('location')} maxLength={120} placeholder={ar?'مثال: الدوحة، الوعب':'e.g. Doha, Al Waab'}/>{error('location')}</label>
      <label htmlFor="quote-size">{label('size')}<input {...attributes('size')} maxLength={60} placeholder={ar?'مثال: ١٢٠ م²':'e.g. 120 m²'}/></label>
      <label htmlFor="quote-date">{label('date')}<input {...attributes('date')} type="date" lang={locale}/></label>
      <label className="full" htmlFor="quote-message">{label('message')}<textarea {...attributes('message')} rows={5} maxLength={1500}/>{error('message')}</label>
    </div>
    <label className="consent" htmlFor="quote-consent"><input id="quote-consent" type="checkbox" name="consent" required aria-invalid={!!errors.consent} aria-describedby={errors.consent?'error-consent':undefined}/><span>{ar?'أفهم أن هذا نموذج تجريبي وأن البيانات المدخلة لن تُرسل أو تُخزَّن.':'I understand this is a demo and the details I enter will not be sent or stored.'}</span></label>
    {error('consent')}
    <button className="button primary" type="submit">{ar?'تحقّق من الحقول':'Check form fields'}</button></fieldset>
    <noscript><p className="form-note">{ar?'فعّل جافاسكربت للتحقق من الحقول في المتصفح.':'Enable JavaScript to check the fields in your browser.'}</p></noscript>
    <p className="form-note">{ar?'نموذج تجريبي · الإرسال غير متاح':'Demo — submission not connected'}</p>
    {valid && <p className="form-result" role="status">{ar?'الحقول مكتملة. لم تُرسل أي بيانات.':'The fields are complete. No information was sent.'}</p>}
  </form>;
}
