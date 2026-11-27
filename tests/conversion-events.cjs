const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { runInNewContext } = require('node:vm');
const ts = require('typescript');

const source = ts.transpileModule(readFileSync('src/lib/conversion-events.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;

function load(enabled, locale = 'en', server = false) {
  const sent = [];
  const exports = {};
  const sandbox = {
    exports,
    process: { env: { NEXT_PUBLIC_CONVERSION_EVENTS_ENABLED: enabled } },
    document: { documentElement: { lang: locale } },
    CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options.detail; } },
    ...(server ? {} : { window: { location: { pathname: '/' + locale + '/contact', search: '?private=excluded' }, dispatchEvent: event => sent.push(event) } }),
  };
  runInNewContext(source, sandbox);
  return { track: exports.trackConversion, sent };
}

for (const flag of [undefined, 'false', 'TRUE']) {
  const disabled = load(flag);
  disabled.track('whatsapp_click', 'hero');
  assert.equal(disabled.sent.length, 0, 'Tracking must require explicit opt-in');
}
assert.doesNotThrow(() => load('true', 'en', true).track('email_click', 'page'), 'Server rendering remains safe');
for (const locale of ['en', 'ar']) {
  const enabled = load('true', locale);
  for (const event of ['whatsapp_click', 'telephone_click', 'email_click', 'free_inspection_request', 'service_quote_request', 'project_enquiry']) {
    enabled.track(event, 'quote_form');
    const result = enabled.sent.at(-1);
    assert.equal(result.type, 'abgardening:conversion');
    const detail = JSON.parse(JSON.stringify(result.detail));
    assert.deepEqual(Object.keys(detail).sort(), ['channel', 'context', 'event', 'locale', 'path']);
    assert.equal(detail.locale, locale);
    assert.equal(detail.path, '/' + locale + '/contact');
    assert.equal(detail.channel, event === 'telephone_click' ? 'telephone' : event === 'email_click' ? 'email' : 'whatsapp');
    assert(!JSON.stringify(detail).includes('private=excluded'));
  }
}
console.log('Conversion hooks: opt-in gating, server safety, both locales, channel mapping and query-free payloads passed.');
