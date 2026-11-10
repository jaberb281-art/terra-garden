'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { adminIdentity, requireAdmin, sessionClient } from '@/lib/cms/auth';
import { refreshPublic } from '@/lib/cms/cache';
import { discardOwnedImage } from '@/lib/cms/cloudinary';
import { cloudinaryConfig } from '@/lib/cms/env';
import { InputError, integer, localized, option, projectFields, publishingProblem, serviceFields, uuid, version } from '@/lib/cms/validation';
import type { ImageRecord, ProjectRecord } from '@/lib/cms/records';
import { services } from '@/content/catalog';

export type ActionResult = { error?: string };

function problem(error: unknown): ActionResult {
  return { error: error instanceof InputError ? error.message : 'The change could not be saved. Reload and try again.' };
}

function editUrl(id: string, notice?: string) {
  return '/admin/projects/' + id + '/edit' + (notice ? '?notice=' + notice : '');
}

export async function login(_: ActionResult, form: FormData): Promise<ActionResult> {
  const client = await sessionClient();
  if (!client) return { error: 'Supabase is not configured.' };
  const generic = { error: 'Sign-in failed. Check your credentials or contact the site owner.' };
  const email = form.get('email');
  const password = form.get('password');
  if (typeof email !== 'string' || typeof password !== 'string' ||
      email.length > 254 || password.length > 1024 || !email.trim() || !password) return generic;
  const { error } = await client.auth.signInWithPassword({ email: email.trim(), password });
  if (error) return generic;
  if (!await adminIdentity()) {
    await client.auth.signOut({ scope: 'local' });
    return generic;
  }
  redirect('/admin');
}

export async function logout() {
  const client = await sessionClient();
  if (client) {
    const { error } = await client.auth.signOut({ scope: 'local' });
    if (error) redirect('/admin/settings?logout=failed');
  }
  redirect('/admin/login');
}

export async function createProject(_: ActionResult, form: FormData): Promise<ActionResult> {
  const { client } = await requireAdmin();
  let id: string;
  try {
    const { data, error } = await client.from('projects').insert(projectFields(form)).select('id').single();
    if (error?.code === '23505') return { error: 'That slug already exists.' };
    if (error || !data) return problem(error);
    id = data.id;
  } catch (error) { return problem(error); }
  redirect(editUrl(id, 'created'));
}

export async function saveProject(_: ActionResult, form: FormData): Promise<ActionResult> {
  const { client } = await requireAdmin();
  let id: string;
  try {
    id = uuid(form, 'id');
    const fields = projectFields(form);
    const { data, error } = await client.from('projects').update(fields)
      .eq('id', id).eq('updated_at', version(form)).select('slug,status').maybeSingle();
    if (error?.code === '23505') return { error: 'That slug already exists.' };
    if (error?.code === 'P0001') return { error: 'Keep the published slug unchanged and complete both languages. Unpublish to save incomplete content.' };
    if (error) return problem(error);
    if (!data) return { error: 'This project changed. Reload before saving.' };
    if (data.status === 'published') refreshPublic({ kind: 'projects', value: data.slug });
  } catch (error) { return problem(error); }
  redirect(editUrl(id, 'saved'));
}

export async function changePublication(_: ActionResult, form: FormData): Promise<ActionResult> {
  const { client } = await requireAdmin();
  let id: string;
  let next: 'draft' | 'published';
  try {
    id = uuid(form, 'id');
    next = option(form, 'status', ['draft', 'published'] as const);
    const { data, error } = await client.from('projects').select('*,project_images(*)').eq('id', id).maybeSingle();
    if (error || !data) return { error: 'Project not found.' };
    const project = data as ProjectRecord;
    if (project.updated_at !== version(form)) return { error: 'This project changed. Reload before changing publication.' };
    if (project.status === next) return { error: 'The project already has that status. Reload the page.' };
    if (next === 'published') {
      if (!cloudinaryConfig()) return { error: 'Configure Cloudinary before publishing.' };
      const invalid = publishingProblem(project);
      if (invalid) return { error: invalid };
      if (project.provenance === 'authentic' && form.get('verified') !== 'yes') {
        return { error: 'Confirm the work and location are authentic and approved for publication.' };
      }
    }
    const { data: saved, error: writeError } = await client.from('projects').update({ status: next })
      .eq('id', id).eq('updated_at', project.updated_at).eq('status', project.status).select('slug').maybeSingle();
    if (writeError || !saved) return { error: 'Publication did not change. Reload and review the project.' };
    refreshPublic({ kind: 'projects', value: saved.slug });
  } catch (error) { return problem(error); }
  redirect(editUrl(id, next === 'published' ? 'published' : 'unpublished'));
}

export async function deleteProject(_: ActionResult, form: FormData): Promise<ActionResult> {
  const { client } = await requireAdmin();
  try {
    const id = uuid(form, 'id');
    if (form.get('confirm') !== 'yes') return { error: 'Confirm deletion first.' };
    const { data, error } = await client.from('projects').delete()
      .eq('id', id).eq('status', 'draft').eq('updated_at', version(form)).select('id,slug').maybeSingle();
    if (error || !data) return { error: 'Reload and check that the project is a draft before deleting.' };
    // Project deletion cascades in Postgres. Retain the detached originals for
    // recovery and reconcile them by project prefix through an owner review.
    refreshPublic({ kind: 'projects', value: data.slug });
  } catch (error) { return problem(error); }
  redirect('/admin/projects?notice=deleted');
}

export async function changeMedia(_: ActionResult, form: FormData): Promise<ActionResult> {
  const { client } = await requireAdmin();
  let project: string;
  let notice: string;
  try {
    project = uuid(form, 'project');
    const id = uuid(form, 'image');
    const mode = option(form, 'mode', ['save', 'remove'] as const);
    if (mode === 'remove' && form.get('confirm') !== 'yes') return { error: 'Confirm removal first.' };
    const media = client.from('project_images');
    const query = mode === 'remove' ? media.delete() : media.update({
      alt: localized(form, 'alt', 240, true), caption: localized(form, 'caption', 300), sort_order: integer(form, 'sort_order'),
    });
    const { data, error } = await query.eq('id', id).eq('project_id', project).select('*').maybeSingle();
    if (error || !data) return { error: 'Media could not be changed. Make sure the project is a draft.' };
    notice = 'media';
    if (mode === 'remove' && !await discardOwnedImage(data as ImageRecord)) {
      console.warn('TERRA removed image cleanup pending:', data.public_id);
      notice = 'media-cleanup';
    }
    revalidatePath('/admin/projects/' + project + '/edit');
  } catch (error) { return problem(error); }
  redirect(editUrl(project, notice));
}

export async function saveService(_: ActionResult, form: FormData): Promise<ActionResult> {
  const { client } = await requireAdmin();
  let slug: string;
  try {
    slug = option(form, 'slug', services.map(service => service.slug));
    const data = serviceFields(form);
    const { error } = await client.rpc('terra_save_service', {
      p_slug: slug, p_version: version(form), p_service: data.service, p_faqs: data.faqs,
    });
    if (error?.code === 'P0001') return { error: 'This service changed. Reload before saving.' };
    if (error) return problem(error);
    refreshPublic({ kind: 'services', value: slug });
  } catch (error) { return problem(error); }
  redirect('/admin/services?service=' + slug + '&notice=saved');
}

export async function changePassword(_: ActionResult, form: FormData): Promise<ActionResult> {
  const { client } = await requireAdmin();
  const password = form.get('password');
  if (typeof password !== 'string' || password.length < 12 || password.length > 128 || password !== form.get('confirmation')) {
    return { error: 'Use 12–128 characters and enter the same password twice.' };
  }
  const { error } = await client.auth.updateUser({ password });
  if (error) return { error: 'Password change failed. If your session is old, sign in again and retry.' };
  redirect('/admin/settings?notice=password');
}
