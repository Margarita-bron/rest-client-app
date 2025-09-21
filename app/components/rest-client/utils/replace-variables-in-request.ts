import type { Header } from '~/components/rest-client/rest-client-page';
import type { Variable } from '~/types/variables';

export function replaceVariablesInRequest(
  url: string,
  body: string,
  headers: Header[],
  variables: Variable[]
): { url: string; body: string; headers: Header[] } {
  const replace = (text: string) => {
    if (!text) return text;
    let result = text;
    variables
      .filter((v) => v.enabled && v.key)
      .forEach((v) => {
        const pattern = new RegExp(`{{${v.key}}}`, 'g');
        result = result.replace(pattern, v.value);
      });
    return result;
  };

  const replacedBody = replace(body);

  let jsonBody = replacedBody;
  try {
    const parsed = JSON.parse(replacedBody);
    jsonBody = JSON.stringify(parsed);
  } catch {
    jsonBody = replacedBody;
  }

  return {
    url: replace(url),
    body: jsonBody,
    headers: headers.map((h) =>
      h.enabled ? { ...h, key: replace(h.key), value: replace(h.value) } : h
    ),
  };
}
