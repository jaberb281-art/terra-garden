import 'server-only';

import { randomUUID } from 'node:crypto';
import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';
import { cloudinaryConfig } from './env';
import { managedImageId, imageWidths, type ImageRecord, type ImageRole } from './records';

export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

export function imageFormat(buffer: Buffer): ImageRecord['format'] | null {
  if (buffer.length < 12) return null;
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return 'jpg';
  if (buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return 'png';
  if (buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') return 'webp';
  return null;
}

export async function uploadProjectImage(buffer: Buffer, project: string, role: ImageRole, format: ImageRecord['format']) {
  const config = cloudinaryConfig();
  if (!config) throw new Error('Cloudinary unavailable');
  cloudinary.config(config);
  const publicId = ['terra', 'projects', project, role, randomUUID()].join('/');
  const data = await new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({
      public_id: publicId, resource_type: 'image', type: 'authenticated',
      allowed_formats: [format], overwrite: false, use_filename: false,
      signature_algorithm: 'sha256', timeout: 25000,
    }, (error, response) => {
      if (error || !response) reject(new Error('Cloudinary upload failed'));
      else resolve(response);
    });
    stream.on('error', reject);
    stream.end(buffer);
  });
  if (data.public_id !== publicId || data.resource_type !== 'image' || data.type !== 'authenticated' ||
    !/^[a-f0-9]{32}$/.test(data.asset_id) || data.format !== format ||
    !Number.isInteger(data.width) || !Number.isInteger(data.height) || !Number.isInteger(data.version) ||
    data.width < 320 || data.height < 240 || data.width > 6000 || data.height > 6000 ||
    data.width * data.height > 24000000 || data.bytes < 1 || data.bytes > MAX_IMAGE_BYTES ||
    (typeof data.pages === 'number' && data.pages > 1)) {
    // An exact match to the generated, non-overwriting ID is safe to discard.
    if (data.public_id === publicId && data.type === 'authenticated' && data.resource_type === 'image') {
      await cloudinary.uploader.destroy(publicId, { type: 'authenticated', resource_type: 'image', invalidate: true }).catch(() => undefined);
    }
    return null;
  }
  return {
    project_id: project, role, public_id: publicId, asset_id: data.asset_id,
    width: data.width, height: data.height, bytes: data.bytes, format, version: data.version,
  };
}

export async function discardOwnedImage(image: Pick<ImageRecord, 'project_id' | 'role' | 'public_id' | 'asset_id'>) {
  const config = cloudinaryConfig();
  if (!config || !managedImageId(image)) return false;
  cloudinary.config(config);
  try {
    const current = await cloudinary.api.resource(image.public_id, { resource_type: 'image', type: 'authenticated' });
    if (current.asset_id !== image.asset_id || current.public_id !== image.public_id ||
      current.resource_type !== 'image' || current.type !== 'authenticated') return false;
    const result = await cloudinary.uploader.destroy(image.public_id, { resource_type: 'image', type: 'authenticated', invalidate: true });
    return result.result === 'ok' || result.result === 'not found';
  } catch {
    return false;
  }
}

export async function imageResponse(image: ImageRecord | null, request: Request) {
  const config = cloudinaryConfig();
  if (!config || !image || !managedImageId(image)) return new Response(null, { status: 404 });
  const requested = Number(new URL(request.url).searchParams.get('w') ?? 828);
  const width = imageWidths.find(value => value === requested);
  if (!width) return new Response(null, { status: 400 });
  cloudinary.config(config);
  const url = cloudinary.url(image.public_id, {
    resource_type: 'image', type: 'authenticated', sign_url: true, secure: true,
    format: 'webp', version: image.version, transformation: [{ crop: 'limit', width, quality: 'auto' }],
  });
  try {
    const upstream = await fetch(url, { cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(10000) });
    if (!upstream.ok || !upstream.body || !upstream.headers.get('content-type')?.startsWith('image/webp')) {
      return new Response(null, { status: 502 });
    }
    return new Response(upstream.body, {
      headers: { 'Content-Type': 'image/webp', 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff' },
    });
  } catch {
    return new Response(null, { status: 502 });
  }
}
