/** Studio represents empty optional object/image fields by absence, not null. */
export function emptyMediaPaths(document: Record<string, unknown>): string[] {
  const paths = ['heroPhoto', 'founderPhoto', 'testimonial', 'workPhotos'].filter(key => document[key] === null);
  const work = document.workPhotos;
  if (work && typeof work === 'object') {
    for (const key of ['medications', 'education', 'outreach']) {
      if ((work as Record<string, unknown>)[key] === null) paths.push(`workPhotos.${key}`);
    }
  }
  return paths;
}

export function omitEmptyMedia(document: Record<string, unknown>): Record<string, unknown> {
  const result = structuredClone(document);
  for (const path of emptyMediaPaths(document)) {
    const [parent, child] = path.split('.');
    if (child) delete (result[parent] as Record<string, unknown>)[child];
    else delete result[parent];
  }
  return result;
}
