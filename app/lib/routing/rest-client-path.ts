import type { Header } from '~/components/rest-client/rest-client-page';
import { v4 as uuidv4 } from 'uuid';

export function base64EncodeUtf8Share(input: string): string {
  const base64 = btoa(
    encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    )
  );
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function base64DecodeUtf8Share(input: string): string {
  input = input.replace(/-/g, '+').replace(/_/g, '/');
  const pad = input.length % 4;
  if (pad) input += '='.repeat(4 - pad);
  const decoded = atob(input);
  return decodeURIComponent(
    Array.prototype.map
      .call(
        decoded,
        (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      )
      .join('')
  );
}

export function buildShareRoute(
  method: string,
  targetUrl: string,
  bodyString: string,
  current: Header[]
): string {
  const encodedUrl = base64EncodeUtf8Share(targetUrl);

  const hasBody =
    bodyString &&
    ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase());
  const encodedBody = hasBody ? `/${base64EncodeUtf8Share(bodyString)}` : '';

  const query = current
    .filter((h) => h.enabled && h.key)
    .map((h) => `${encodeURIComponent(h.key)}=${encodeURIComponent(h.value)}`)
    .join('&');

  const queryString = query ? `?${query}` : '';

  return `rest-client/${method.toUpperCase()}/${encodedUrl}${encodedBody}${queryString}`;
}

export function parseRequestFromUrl(
  params: Record<string, string | undefined>,
  searchParams: URLSearchParams
): {
  method: string;
  url: string;
  body: string;
  headers: Header[];
} {
  let method = 'GET';
  let url = '';
  let body = '';
  const headers: Header[] = [];

  if (params.method) method = params.method.toUpperCase();

  if (params['url']) url = base64DecodeUtf8Share(params['url']);
  if (params['body']) body = base64DecodeUtf8Share(params['body']);

  for (const [key, value] of searchParams.entries()) {
    headers.push({
      id: uuidv4(),
      key: decodeURIComponent(key),
      value: decodeURIComponent(value),
      enabled: true,
    });
  }

  return { method, url, body, headers };
}
