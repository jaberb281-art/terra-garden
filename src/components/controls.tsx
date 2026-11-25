'use client';
import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Menu, X, ZoomIn } from 'lucide-react';
import { categories, navigation, ui, type Locale } from '@/content/site';
import { services, type Project, type SiteService } from '@/content/catalog';
import { projectPhoto } from '@/content/project-media';
import { MediaImage } from './media-image';
import { createWhatsAppLink } from '@/content/whatsapp';

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
    {filter && <div className="filters mobile-fit-bar">
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
type Errors = Partial<Record<Field,string>>;
const requiredFields: readonly Field[] = ['location', 'message'];
const subscribeToHydration = () => () => {};
export function QuoteForm({locale, serviceItems = services, whatsappNumber}: {locale: Locale; serviceItems?: readonly SiteService[]; whatsappNumber?: string}) {
  const [errors,setErrors] = useState<Errors>({});
  const [sent,setSent] = useState<'idle'|'opened'|'unavailable'>('idle');
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
    setErrors(next);
    const first=Object.keys(next)[0];
    if(first) { setSent('idle'); (form.elements.namedItem(first) as HTMLElement|null)?.focus(); return; }
    const pick=(field:'property'|'service')=>{
      const v=value(field);
      if(!v) return '';
      if(v==='other') return ar?'أخرى':'Other';
      const list:readonly {title:Record<Locale,string>;slug?:string;id?:string}[]=field==='service'?serviceItems:categories;
      return list.find(i=>(i.slug??i.id)===v)?.title[locale]??'';
    };
    const lines=[
      ar?'مرحباً، أود الحصول على عرض سعر:':'Hello, I would like a quote:',
      [label('service').replace(/ \(.*\)$/,''),pick('service')],
      [label('property').replace(/ \(.*\)$/,''),pick('property')],
      [label('location'),value('location')],
      [label('size').replace(/ \(.*\)$/,''),value('size')],
      [label('date').replace(/ \(.*\)$/,''),value('date')],
      [label('message'),value('message')],
      [label('name').replace(/ \(.*\)$/,''),value('name')],
      [label('phone').replace(/ \(.*\)$/,''),value('phone')],
    ].map(l=>typeof l==='string'?l:(l[1]?l[0]+': '+l[1]:'')).filter(Boolean);
    const link=createWhatsAppLink(whatsappNumber,lines.join('\n'));
    if(!link) { setSent('unavailable'); return; }
    window.open(link,'_blank','noopener,noreferrer');
    setSent('opened');
  };
  const attributes=(field:Field)=>({id:'quote-'+field,name:field,required:requiredFields.includes(field),'aria-invalid':!!errors[field],'aria-describedby':errors[field]?'error-'+field:undefined});
  const error=(field:Field)=>errors[field]&&<span className="field-error" id={'error-'+field} role="alert">{errors[field]}</span>;
  return <form className="quote-form" method="post" noValidate onSubmit={submit} onChange={()=>{if(sent!=='idle')setSent('idle');}}>
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
    <button className="button primary" type="submit">{ar?'أرسل عبر واتساب':'Send on WhatsApp'}</button></fieldset>
    <noscript><p className="form-note">{ar?'فعّل جافاسكربت لإرسال الطلب.':'Enable JavaScript to send your request.'}</p></noscript>
    <p className="form-note">{ar?'سيفتح واتساب برسالة جاهزة يمكنك مراجعتها قبل الإرسال.':'WhatsApp opens with your message ready. Review it, then press send.'}</p>
    {sent==='opened' && <p className="form-result" role="status">{ar?'فتحنا واتساب برسالتك. اضغط إرسال هناك لإكمال الطلب.':'WhatsApp is open with your message. Press send there to complete your request.'}</p>}
    {sent==='unavailable' && <p className="form-result" role="alert">{ar?'واتساب غير متاح حالياً. يرجى المحاولة لاحقاً.':'WhatsApp isn’t available right now. Please try again later.'}</p>}
  </form>;
}
