import { adminIdentity } from '@/lib/cms/auth';
import { cloudinaryConfig } from '@/lib/cms/env';
import { discardOwnedImage, imageFormat, MAX_IMAGE_BYTES, uploadProjectImage } from '@/lib/cms/cloudinary';
import { imageRoles, uuidPattern, type ImageRecord } from '@/lib/cms/records';
import { InputError, integer, localized, option } from '@/lib/cms/validation';

const MAX_BODY = MAX_IMAGE_BYTES + 16384;

function reply(status: number, message: string) {
  return Response.json({ message }, { status, headers: { 'Cache-Control': 'private, no-store' } });
}

function isSameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  try {
    const source = new URL(origin);
    // Next may normalize its internal request URL to localhost. Compare the
    // browser origin against the HTTP Host retained by the reverse proxy.
    return source.origin === origin && source.host === request.headers.get('host') &&
      source.protocol === new URL(request.url).protocol;
  } catch {
    return false;
  }
}

async function boundedForm(request: Request) {
  const reader = request.body?.getReader();
  if (!reader) return null;
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_BODY) { await reader.cancel(); return null; }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  return new Response(new Uint8Array(Buffer.concat(chunks)), {
    headers: { 'Content-Type': request.headers.get('content-type') ?? '' },
  }).formData();
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(request)) return reply(403, 'Use the upload form in TERRA Admin.');
  const admin = await adminIdentity();
  if (!admin) return reply(401, 'Sign in with an authorized admin account.');
  if (!cloudinaryConfig()) return reply(503, 'Configure Cloudinary before uploading photographs.');
  const { id } = await params;
  if (!uuidPattern.test(id)) return reply(404, 'Project not found.');
  if (!request.headers.get('content-type')?.startsWith('multipart/form-data;')) return reply(415, 'Choose an image in the upload form.');
  if (Number(request.headers.get('content-length')) > MAX_BODY) return reply(413, 'Choose a file up to 4 MB.');
  const { data: parent, error: projectError } = await admin.client.from('projects').select('id,status').eq('id', id).maybeSingle();
  if (projectError) return reply(503, 'Project could not be loaded.');
  if (!parent) return reply(404, 'Project not found.');
  if (parent.status !== 'draft') return reply(409, 'Unpublish the project before replacing media.');

  try {
    const form = await boundedForm(request);
    if (!form) return reply(413, 'Choose a file up to 4 MB.');
    const file = form.get('file');
    if (!(file instanceof File) || !file.size || file.size > MAX_IMAGE_BYTES) return reply(400, 'Choose a JPEG, PNG, or WebP file up to 4 MB.');
    const role = option(form, 'role', imageRoles);
    const alt = localized(form, 'alt', 240, true);
    const caption = localized(form, 'caption', 300);
    const sort_order = integer(form, 'sort_order');
    const buffer = Buffer.from(await file.arrayBuffer());
    const format = imageFormat(buffer);
    if (!format || file.type !== 'image/' + (format === 'jpg' ? 'jpeg' : format)) return reply(415, 'The file must be a valid JPEG, PNG, or WebP image.');
    const uploaded = await uploadProjectImage(buffer, id, role, format);
    if (!uploaded) return reply(422, 'Use a still image between 320 × 240 and 6000 × 6000 pixels, up to 24 megapixels.');
    const { data, error } = await admin.client.rpc('terra_replace_image', {
      p_project: id, p_image: { ...uploaded, alt, caption, sort_order },
    });
    if (error || !data?.image) {
      // Only delete after a definitive PostgreSQL rejection. A lost response may
      // mean the insert committed, in which case the asset must be preserved.
      if (error?.code && /^[0-9A-Z]{5}$/.test(error.code)) {
        if (!await discardOwnedImage(uploaded)) console.warn('TERRA upload cleanup pending:', uploaded.public_id);
      } else {
        console.warn('TERRA upload attachment uncertain:', uploaded.public_id);
      }
      return reply(409, 'The photo could not be confirmed. Reload the project and check its media before retrying.');
    }
    if (data.replaced && !await discardOwnedImage(data.replaced as ImageRecord)) {
      console.warn('TERRA previous image cleanup pending:', data.replaced.public_id);
    }
    return reply(201, 'Image saved.');
  } catch (error) {
    if (error instanceof InputError) return reply(400, error.message);
    if (error instanceof TypeError) return reply(400, 'The upload could not be read. Choose the image again.');
    return reply(502, 'The upload failed. Check Cloudinary and retry.');
  }
}
