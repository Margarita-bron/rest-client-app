import { describe, it, expect } from 'vitest';
import type { Header } from '~/components/rest-client/rest-client-page';
import type { Variable } from '~/types/variables';
import { replaceVariablesInRequest } from '~/components/rest-client/utils/replace-variables-in-request';

describe('replaceVariablesInRequest', () => {
  const variables: Variable[] = [
    { id: '1', key: 'VAR1', value: 'value1', enabled: true },
    { id: '2', key: 'VAR2', value: 'value2', enabled: true },
    { id: '3', key: 'DISABLED', value: 'nope', enabled: false },
  ];

  const headers: Header[] = [
    {
      id: 'h1',
      key: 'Content-{{VAR1}}',
      value: 'application/{{VAR2}}',
      enabled: true,
    },
    { id: 'h2', key: 'X-Test', value: '123', enabled: false },
  ];

  it('replaces variables in url, body, and headers', () => {
    const url = 'https://api.com/{{VAR1}}/endpoint';
    const body = '{"field":"{{VAR2}}"}';

    const result = replaceVariablesInRequest(url, body, headers, variables);

    expect(result.url).toBe('https://api.com/value1/endpoint');
    expect(result.body).toBe(JSON.stringify({ field: 'value2' }));
    expect(result.headers[0].key).toBe('Content-value1');
    expect(result.headers[0].value).toBe('application/value2');
    expect(result.headers[1].key).toBe('X-Test');
    expect(result.headers[1].value).toBe('123');
  });

  it('does not replace disabled variables', () => {
    const url = 'https://api.com/{{DISABLED}}';
    const body = '{{DISABLED}}';
    const result = replaceVariablesInRequest(url, body, headers, variables);

    expect(result.url).toBe('https://api.com/{{DISABLED}}');
    expect(result.body).toBe('{{DISABLED}}');
  });

  it('returns body as-is if invalid JSON', () => {
    const body = '{"field": {{VAR2}} }';
    const url = 'https://api.com';
    const result = replaceVariablesInRequest(url, body, headers, variables);

    expect(result.body).toBe('{"field": value2 }');
  });

  it('handles empty body or url gracefully', () => {
    const result = replaceVariablesInRequest('', '', [], variables);
    expect(result.url).toBe('');
    expect(result.body).toBe('');
    expect(result.headers).toEqual([]);
  });
});
