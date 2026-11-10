import { services } from '@/content/catalog';
import { pair } from '@/content/site';
import { categories, reservedProjectSlugs, serviceImages, slugPattern, uuidPattern, type ProjectRecord } from './records';

export class InputError extends Error {}

export function text(form: FormData, key: string, max: number, required = false) {
  const value = form.get(key);
  const result = typeof value === 'string' ? value.trim() : '';
  if ((required && !result) || result.length > max) throw new InputError('Check the field: ' + key + '.');
  return result;
}

export function localized(form: FormData, key: string, max: number, required = false) {
  return pair(text(form, key + '_en', max, required), text(form, key + '_ar', max, required));
}

export function option<T extends string>(form: FormData, key: string, choices: readonly T[]) {
  const value = text(form, key, 80);
  const result = choices.find(choice => choice === value);
  if (!result) throw new InputError('Select a valid ' + key + '.');
  return result;
}

export function integer(form: FormData, key: string, max = 10000) {
  const raw = text(form, key, 6);
  const value = Number(raw || '0');
  if (!/^\d*$/.test(raw) || !Number.isSafeInteger(value) || value > max) throw new InputError('Check the number in ' + key + '.');
  return value;
}

export function uuid(form: FormData, key: string) {
  const id = text(form, key, 36, true);
  if (!uuidPattern.test(id)) throw new InputError('Invalid record identifier.');
  return id;
}

export function version(form: FormData) {
  const value = text(form, 'version', 45, true);
  if (!/^\d{4}-\d\d-\d\dT/.test(value) || !Number.isFinite(Date.parse(value))) throw new InputError('Reload the record before saving.');
  return value;
}

export function projectFields(form: FormData) {
  const slug = text(form, 'slug', 80, true).toLowerCase();
  if (!slugPattern.test(slug) || reservedProjectSlugs.some(reserved => reserved === slug)) {
    throw new InputError('Use a unique URL slug made of lowercase letters, numbers and single hyphens. Sample slugs are reserved.');
  }
  const related = [...new Set(form.getAll('related_services'))];
  if (related.length > 4 || related.some(value => !services.some(service => service.slug === value))) {
    throw new InputError('Select valid related services.');
  }
  return {
    slug, category: option(form, 'category', categories),
    title: localized(form, 'title', 120),
    description: localized(form, 'description', 600),
    story: {
      challenge: localized(form, 'challenge', 2500),
      approach: localized(form, 'approach', 2500),
      outcome: localized(form, 'outcome', 2500),
    },
    location: localized(form, 'location', 120),
    related_services: related as string[],
    provenance: option(form, 'provenance', ['illustrative', 'authentic']),
    seo_title: localized(form, 'seo_title', 90),
    seo_description: localized(form, 'seo_description', 220),
    sort_order: integer(form, 'sort_order'),
  };
}

export function publishingProblem(project: ProjectRecord) {
  const required = [project.title, project.description, project.story.challenge, project.story.approach, project.story.outcome];
  if (required.some(pair => !pair.en.trim() || !pair.ar.trim())) return 'Complete the title, description and all story fields in both languages.';
  const before = project.project_images.find(image => image.role === 'before');
  const after = project.project_images.find(image => image.role === 'after');
  if (!before || !after) return 'Upload both a Before and an After photograph.';
  if (before.width !== after.width || before.height !== after.height) return 'The Before and After photographs must have the same pixel dimensions.';
  return null;
}

export function serviceFields(form: FormData) {
  const english = text(form, 'scope_en', 3600, true).split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  const arabic = text(form, 'scope_ar', 3600, true).split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  if (!english.length || english.length !== arabic.length || english.length > 12 ||
    [...english, ...arabic].some(line => line.length > 300)) {
    throw new InputError('Use 1–12 scope lines in each language, with matching line counts and at most 300 characters per line.');
  }
  const count = integer(form, 'faq_count', 12);
  const faqs = Array.from({ length: count }, (_, index) => ({
    question: localized(form, 'question_' + index, 200, true),
    answer: localized(form, 'answer_' + index, 1200, true),
  }));
  return {
    service: {
      title: localized(form, 'title', 100, true), summary: localized(form, 'summary', 350, true),
      detail: localized(form, 'detail', 3500, true), scope: english.map((line, index) => pair(line, arabic[index])),
      image: option(form, 'image', serviceImages), image_alt: localized(form, 'image_alt', 240, true),
      seo_title: localized(form, 'seo_title', 90), seo_description: localized(form, 'seo_description', 220),
      status: option(form, 'status', ['draft', 'published']), sort_order: integer(form, 'sort_order'),
    },
    faqs,
  };
}
