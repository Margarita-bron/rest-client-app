import type { Header } from '~/routes/rest-client';

export type codeGenProps = {
  method: string;
  url: string;
  headers?: Header[];
  body?: string;
};
function filterAndMapHeaders(headers?: Header[]): Record<string, string> {
  if (!headers) return {};
  return headers.reduce(
    (acc, h) => {
      if (h.enabled && h.key && h.value) {
        acc[h.key] = h.value;
      }
      return acc;
    },
    {} as Record<string, string>
  );
}

export function generateCurl({
  method,
  url,
  headers,
  body,
}: codeGenProps): string {
  let snippet = `curl -X ${method.toUpperCase()} "${url}"`;
  const filteredHeaders = filterAndMapHeaders(headers);
  for (const [key, value] of Object.entries(filteredHeaders)) {
    snippet += ` \\\n  -H "${key}: ${value}"`;
  }
  if (body) {
    snippet += ` \\\n  -d '${body}'`;
  }
  return snippet;
}

export function generateFetch({
  method,
  url,
  headers,
  body,
}: codeGenProps): string {
  const filteredHeaders = filterAndMapHeaders(headers);
  const options: any = { method: method.toUpperCase() };
  if (Object.keys(filteredHeaders).length) options.headers = filteredHeaders;
  if (body) options.body = body;

  return `fetch("${url}", ${JSON.stringify(options, null, 2)})
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));`;
}

export function generateXHR({
  method,
  url,
  headers,
  body,
}: codeGenProps): string {
  const filteredHeaders = filterAndMapHeaders(headers);
  const headersCode = Object.entries(filteredHeaders)
    .map(([k, v]) => `xhr.setRequestHeader("${k}", "${v}");`)
    .join('\n');

  return `
const xhr = new XMLHttpRequest();
xhr.open("${method.toUpperCase()}", "${url}");
${headersCode}
xhr.onload = () => console.log(xhr.responseText);
xhr.onerror = () => console.error(xhr.statusText);
xhr.send(${body ? `'${body}'` : 'null'});`;
}

export function generateNodeAxios({
  method,
  url,
  headers,
  body,
}: codeGenProps): string {
  const filteredHeaders = filterAndMapHeaders(headers);

  return `
const axios = require('axios');
axios({
  method: '${method.toLowerCase()}',
  url: '${url}',
  headers: ${JSON.stringify(filteredHeaders, null, 2)},
  data: ${body ? `'${body}'` : 'null'}
}).then(response => console.log(response.data))
  .catch(error => console.error(error));`;
}

export function generatePythonRequests({
  method,
  url,
  headers,
  body,
}: codeGenProps): string {
  const filteredHeaders = filterAndMapHeaders(headers);

  return `
import requests

headers = ${JSON.stringify(filteredHeaders, null, 2)}

response = requests.request("${method.toUpperCase()}", "${url}", headers=headers${body ? `, data='''${body}'''` : ''})
print(response.text)`;
}

export function generateJavaOkHttp({
  method,
  url,
  headers,
  body,
}: codeGenProps): string {
  const filteredHeaders = filterAndMapHeaders(headers);
  const headersCode = Object.entries(filteredHeaders)
    .map(([k, v]) => `.addHeader("${k}", "${v}")`)
    .join('\n  ');

  const bodyCode = body
    ? `RequestBody body = RequestBody.create(MediaType.parse("application/json; charset=utf-8"), "${body}");`
    : '';
  const methodCall = body
    ? `method("${method.toUpperCase()}", body)`
    : `method("${method.toUpperCase()}", null)`;

  return `
import okhttp3.*;

public class Main {
  public static void main(String[] args) throws Exception {
    OkHttpClient client = new OkHttpClient();

    ${bodyCode}

    Request request = new Request.Builder()
      .url("${url}")
      ${headersCode}
      .${methodCall}
      .build();

    Response response = client.newCall(request).execute();
    System.out.println(response.body().string());
  }
}`;
}

export function generateCSharpHttpClient({
  method,
  url,
  headers,
  body,
}: codeGenProps): string {
  const filteredHeaders = filterAndMapHeaders(headers);
  const headersCode = Object.entries(filteredHeaders)
    .map(([k, v]) => `client.DefaultRequestHeaders.Add("${k}", "${v}");`)
    .join('\n    ');

  return `
using System;
using System.Net.Http;
using System.Threading.Tasks;

class Program {
    static async Task Main(string[] args) {
        var client = new HttpClient();

        ${headersCode}

        var request = new HttpRequestMessage(HttpMethod.${method.charAt(0).toUpperCase() + method.slice(1).toLowerCase()}, "${url}");
        ${body ? `request.Content = new StringContent("${body}", System.Text.Encoding.UTF8, "application/json");` : ''}

        var response = await client.SendAsync(request);
        var responseBody = await response.Content.ReadAsStringAsync();

        Console.WriteLine(responseBody);
    }
}`;
}

export function generateGo({
  method,
  url,
  headers,
  body,
}: codeGenProps): string {
  const filteredHeaders = filterAndMapHeaders(headers);
  const headersCode = Object.entries(filteredHeaders)
    .map(([k, v]) => `req.Header.Set("${k}", "${v}")`)
    .join('\n  ');

  return `
package main

import (
  "fmt"
  "net/http"
  "io/ioutil"
  "strings"
)

func main() {
  client := &http.Client{}
  req, err := http.NewRequest("${method.toUpperCase()}", "${url}", strings.NewReader("${body || ''}"))
  if err != nil {
    panic(err)
  }
  ${headersCode}

  resp, err := client.Do(req)
  if err != nil {
    panic(err)
  }
  defer resp.Body.Close()

  bodyBytes, err := ioutil.ReadAll(resp.Body)
  if err != nil {
    panic(err)
  }
  bodyString := string(bodyBytes)
  fmt.Println(bodyString)
}
`;
}
