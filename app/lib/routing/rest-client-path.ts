import type { Header } from '~/routes/rest-client';

export function buildRestClientUrl(
  method: string,
  url: string,
  body: string | null,
  headers: Header[]
): string {
  const encodedUrl = btoa(url);
  const encodedBody = body ? btoa(body) : '';
  const query = new URLSearchParams();

  headers.forEach(({ key, value, enabled }) => {
    if (enabled && key && value) {
      query.set(key, encodeURIComponent(value));
    }
  });

  let path = `/${method}/${encodedUrl}`;
  if (body) path += `/${encodedBody}`;
  const queryString = query.toString();

  return queryString ? `${path}?${queryString}` : path;
}
