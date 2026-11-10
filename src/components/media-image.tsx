'use client';

import Image, { type ImageLoaderProps, type ImageProps } from 'next/image';
import { imageWidths } from '@/lib/cms/records';

function cmsLoader({ src, width }: ImageLoaderProps) {
  const size = imageWidths.find(candidate => candidate >= width) ?? 1920;
  return src + '?w=' + size;
}

export function MediaImage(props: ImageProps) {
  const src = props.src;
  const managed = typeof src === 'string' && /^\/(?:media\/project-images|admin\/media)\/[0-9a-f-]+$/i.test(src);
  return <Image {...props} alt={props.alt} loader={managed ? cmsLoader : undefined} />;
}
