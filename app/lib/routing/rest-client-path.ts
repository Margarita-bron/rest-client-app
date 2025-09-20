import type { Header } from '~/routes/rest-client';

export function base64EncodeUtf8(input: string): string {
  const base64 = btoa(
    encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    )
  );
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function base64DecodeUtf8(input: string): string {
  input = input.replace(/-/g, '+').replace(/_/g, '/');
  const pad = input.length % 4;
  if (pad) {
    input += '='.repeat(4 - pad);
  }
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

export function buildQueryFromHeaders(current: Header[]): string {
  const parts: string[] = [];
  current.forEach((h) => {
    if (h.enabled && h.key) {
      parts.push(`${encodeURIComponent(h.key)}=${encodeURIComponent(h.value)}`);
    }
  });
  return parts.length ? `?${parts.join('&')}` : '';
}

export function buildShareRoute(
  method: string,
  targetUrl: string,
  bodyString: string,
  current: Header[]
): string {
  const encodedUrl = base64EncodeUtf8(targetUrl);
  const hasBody =
    bodyString &&
    ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase());
  const encodedBody = hasBody ? `/${base64EncodeUtf8(bodyString)}` : '';
  const query = buildQueryFromHeaders(current);
  return `rest-client/${method.toUpperCase()}/${encodedUrl}${encodedBody}${query}`;
}

import { v4 as uuidv4 } from 'uuid';

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

  try {
    if (params.method) method = params.method.toUpperCase();
    if (params['url']) url = base64DecodeUtf8(params['url']);
    if (params['body']) body = base64DecodeUtf8(params['body']);

    for (const [key, value] of searchParams.entries()) {
      headers.push({
        id: uuidv4(),
        key: decodeURIComponent(key),
        value: decodeURIComponent(value),
        enabled: true,
      });
    }
  } catch (err) {
    console.warn('Error parsing request from URL:', err);
  }

  return { method, url, body, headers };
}
