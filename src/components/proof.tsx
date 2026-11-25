import Image from 'next/image';
import { photo, type Locale } from '@/content/site';
import { proofCopy, stats, testimonials, trustPoints } from '@/content/proof';
import { CountUp } from './count-up';

export function Proof({ locale }: { locale: Locale }) {
  if (!stats.length && !testimonials.length) return null;
  return (
    <section className="section proof" aria-labelledby="proof-heading">
      <div className="shell">
        <div className="section-head"><div><p className="eyebrow">{proofCopy.tag[locale]}</p><h2 id="proof-heading">{proofCopy.title[locale]}</h2></div></div>
        {stats.length > 0 && (
          <dl className="proof-stats">
            {stats.map(stat => (
              <div key={stat.label.en}>
                <dd><CountUp value={stat.value} suffix={stat.suffix} locale={locale} /></dd>
                <dt>{stat.label[locale]}</dt>
              </div>
            ))}
          </dl>
        )}
        {testimonials.length > 0 && (
          <div className="proof-quotes">
            {testimonials.map(item => (
              <figure key={item.name + item.quote.en}>
                <blockquote>{item.quote[locale]}</blockquote>
                <figcaption><strong>{item.name}</strong>{item.place && <span>{item.place[locale]}</span>}</figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function TrustStrip({ locale }: { locale: Locale }) {
  return (
    <div className="trust-band"><ul className="shell trust-strip">
      {trustPoints.map(point => (
        <li key={point.title.en}>
          <div className="trust-thumbnail"><Image src={photo(point.image)} alt={point.alt[locale]} fill sizes="(max-width: 820px) 64px, 80px" /></div>
          <div className="trust-copy"><strong>{point.title[locale]}</strong><span>{point.detail[locale]}</span></div>
        </li>
      ))}
    </ul></div>
  );
}
