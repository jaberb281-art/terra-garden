import type { Project, ProjectPhoto } from './catalog';
import { photo } from './site';

export function projectPhoto(project: Project, stage: 'before' | 'after'): ProjectPhoto {
  return project.media?.[stage] ?? {
    src: photo(project.image + '-' + stage),
    alt: stage === 'before' ? project.beforeAlt : project.afterAlt,
    width: 508,
    height: 508,
  };
}
