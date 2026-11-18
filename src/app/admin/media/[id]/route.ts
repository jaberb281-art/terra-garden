import { adminIdentity } from '@/lib/cms/auth';
import { imageResponse } from '@/lib/cms/cloudinary';
import { uuidPattern, type ImageRecord } from '@/lib/cms/records';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await adminIdentity();
  if (!admin) return new Response(null, { status: 401 });
  const { id } = await params;
  if (!uuidPattern.test(id)) return new Response(null, { status: 404 });
  const { data, error } = await admin.client.from('project_images').select('*').eq('id', id).maybeSingle();
  if (error) return new Response(null, { status: 503 });
  return imageResponse(data as ImageRecord | null, request);
}
