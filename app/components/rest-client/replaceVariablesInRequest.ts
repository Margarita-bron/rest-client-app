import type { Header } from '~/routes/rest-client';
import type { Variable } from '~/types/variables';

export function replaceVariablesInRequest(
  url: string,
  body: string,
  headers: Header[],
  variables: Variable[]
): { url: string; body: string; headers: Header[] } {
  const replace = (text: string) => {
    let result = text;
    variables
      .filter((v) => v.enabled && v.key)
      .forEach((v) => {
        const pattern = new RegExp(`{{${v.key}}}`, 'g');
        result = result.replace(pattern, v.value);
      });
    return result;
  };

  return {
    url: replace(url),
    body: replace(body),
    headers: headers.map((h) =>
      h.enabled ? { ...h, key: replace(h.key), value: replace(h.value) } : h
    ),
  };
}
