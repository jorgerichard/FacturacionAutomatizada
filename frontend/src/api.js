export function buildApiUrl(path) {
  if (!path) {
    return path;
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const configuredBase = (import.meta.env?.VITE_API_BASE_URL || '').trim();

  if (configuredBase) {
    return `${configuredBase}${path.startsWith('/') ? path : `/${path}`}`;
  }

  return `/bff${path.startsWith('/') ? path : `/${path}`}`;
}
