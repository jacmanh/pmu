/** Extracts the race ID from a link */
export const getRaceIdFromLink = (link: string | null): number => {
  if (!link) {
    return 0;
  }
  const hashIndex = link.indexOf('#');
  return hashIndex !== -1 ? parseInt(link.substring(hashIndex + 1), 10) : 0;
};

/** Extracts the id from a link */
export const getIdFromLink = (link: string | null): number => {
  if (!link) {
    return 0;
  }
  const trimmedUrl = link.replace(/^\/|\/$/g, '');
  const segments = trimmedUrl.split('/');
  const lastSegment = segments[segments.length - 1];
  const parts = lastSegment.split('-');
  return parseInt(parts[parts.length - 1], 10);
};
