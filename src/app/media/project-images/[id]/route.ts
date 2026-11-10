import { imageResponse } from '@/lib/cms/cloudinary';
import { publishedImage } from '@/lib/cms/public';
import { uuidPattern } from '@/lib/cms/records';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!uuidPattern.test(id)) return new Response(null, { status: 404 });
  return imageResponse(await publishedImage(id), request);
}
