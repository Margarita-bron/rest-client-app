import {
  generateCurl,
  generateFetch,
  generateXHR,
  generateNodeAxios,
  generatePythonRequests,
  generateJavaOkHttp,
  generateCSharpHttpClient,
  generateGo,
  type codeGenProps,
} from '../generated-code';

const sampleProps: codeGenProps = {
  method: 'post',
  url: 'https://api.example.com/data',
  headers: [
    { id: '1', key: 'Authorization', value: 'Bearer token', enabled: true },
    { id: '2', key: 'Content-Type', value: 'application/json', enabled: true },
  ],
  body: '{"name":"test"}',
};

describe('Code generation functions', () => {
  test('generateCurl includes method, url, headers and body', () => {
    const result = generateCurl(sampleProps);
    expect(result).toContain('curl -X POST "https://api.example.com/data"');
    expect(result).toContain('-H "Authorization: Bearer token"');
    expect(result).toContain('-H "Content-Type: application/json"');
    expect(result).toContain(`-d '${sampleProps.body}'`);
  });

  test('generateFetch includes fetch call with correct options', () => {
    const result = generateFetch(sampleProps);
    expect(result).toContain(`fetch("${sampleProps.url}"`);
    expect(result).toContain(`"method": "POST"`);
    expect(result).toContain(`"Authorization": "Bearer token"`);
    expect(result).toContain(`"Content-Type": "application/json"`);
  });

  test('generateXHR includes open, headers and send', () => {
    const result = generateXHR(sampleProps);
    expect(result).toContain(`xhr.open("POST", "${sampleProps.url}")`);
    expect(result).toContain(
      `xhr.setRequestHeader("Authorization", "Bearer token");`
    );
    expect(result).toContain(
      `xhr.setRequestHeader("Content-Type", "application/json");`
    );
    expect(result).toContain(`xhr.send('${sampleProps.body}');`);
  });

  test('generateNodeAxios includes axios config', () => {
    const result = generateNodeAxios(sampleProps);
    expect(result).toContain(`method: 'post'`);
    expect(result).toContain(`url: '${sampleProps.url}'`);
    expect(result).toContain(`"Authorization": "Bearer token"`);
    expect(result).toContain(`"Content-Type": "application/json"`);
    expect(result).toContain(`data: '${sampleProps.body}'`);
  });

  test('generatePythonRequests includes request call', () => {
    const result = generatePythonRequests(sampleProps);
    expect(result).toContain('import requests');
    expect(result).toContain('headers =');
    expect(result).toContain(
      `response = requests.request("POST", "${sampleProps.url}"`
    );
    expect(result).toContain(`data='''${sampleProps.body}'''`);
  });

  test('generateJavaOkHttp includes headers and body', () => {
    const result = generateJavaOkHttp(sampleProps);
    expect(result).toContain(`.addHeader("Authorization", "Bearer token")`);
    expect(result).toContain(`.addHeader("Content-Type", "application/json")`);
    expect(result).toContain(
      `RequestBody body = RequestBody.create(MediaType.parse("application/json; charset=utf-8"), "${sampleProps.body}");`
    );
    expect(result).toContain(`method("POST", body)`);
  });

  test('generateCSharpHttpClient includes headers and body setup', () => {
    const result = generateCSharpHttpClient(sampleProps);
    expect(result).toContain(
      `client.DefaultRequestHeaders.Add("Authorization", "Bearer token");`
    );
    expect(result).toContain(
      `client.DefaultRequestHeaders.Add("Content-Type", "application/json");`
    );
    expect(result).toContain(
      `new HttpRequestMessage(HttpMethod.Post, "${sampleProps.url}")`
    );
    expect(result).toContain(
      `new StringContent("${sampleProps.body}", System.Text.Encoding.UTF8, "application/json");`
    );
  });

  test('generateGo includes http.NewRequest and headers', () => {
    const result = generateGo(sampleProps);
    expect(result).toContain(`http.NewRequest("POST", "${sampleProps.url}"`);
    expect(result).toContain(`req.Header.Set("Authorization", "Bearer token")`);
    expect(result).toContain(
      `req.Header.Set("Content-Type", "application/json")`
    );
    expect(result).toContain(`strings.NewReader("${sampleProps.body}")`);
  });
});
