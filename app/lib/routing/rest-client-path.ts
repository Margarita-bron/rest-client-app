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
  /**  const query = new URLSearchParams();
  headers.forEach(({ key, value, enabled }) => {
    if (enabled && key && value) {
      query.set(key, value);
    }
  }); */
  return parts.length ? `?${parts.join('&')}` : '';
}

export function buildProxyUrl(
  method: string,
  targetUrl: string,
  bodyString: string,
  current: Header[]
): string {
  const proxyBase = 'http://localhost:5137';
  const encodedUrl = base64EncodeUtf8(targetUrl);
  const hasBody = Boolean(
    bodyString &&
      ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase())
  );
  const encodedBody = hasBody ? `/${base64EncodeUtf8(bodyString)}` : '';
  const query = buildQueryFromHeaders(current);
  return `${proxyBase}/${method.toUpperCase()}/${encodedUrl}${encodedBody}${query}`;
}

export function buildShareRoute(
  method: string,
  targetUrl: string,
  bodyString: string,
  current: Header[]
): string {
  const proxyBase = 'http://localhost:5137';
  const encodedUrl = base64EncodeUtf8(targetUrl);
  const hasBody = Boolean(
    bodyString &&
      ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase())
  );
  const encodedBody = hasBody ? `/${base64EncodeUtf8(bodyString)}` : '';
  const query = buildQueryFromHeaders(current);
  return `${proxyBase}/${method.toUpperCase()}/${encodedUrl}${encodedBody}${query}`;
}
