import { useEffect, useState } from 'react';
import RequestPanel from '../components/rest-client/request-panel/request-panel';
import HeadersEditor from '../components/rest-client/headers-editor/headers-editor';
import RequestBodyEditor from '../components/rest-client/request-body-editor/request-body-editor';
import ResponseView from '../components/rest-client/response-view/response-view';
import axios, { AxiosError } from 'axios';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, saveUserRequestHistory } from '~/lib/firebase/firebase';
import type { User } from 'firebase/auth';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import {
  base64DecodeUtf8,
  buildShareRoute,
} from '~/lib/routing/rest-client-path';
import { useVariables } from '~/hooks/use-variables';
import { availableMethods } from '~/constants/rest-client';
import { v4 as uuidv4 } from 'uuid';

export interface Header {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

const defaultHeaders: Header[] = [
  { id: '1', key: 'Content-Type', value: 'application/json', enabled: true },
];

const RestClient = () => {
  const [user] = useAuthState(auth);
  const { replaceVariablesInString } = useVariables();

  const [selectedMethod, setSelectedMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [requestBody, setRequestBody] = useState('');
  const [responseData, setResponseData] = useState<unknown>(null);
  const [responseRaw, setResponseRaw] = useState<string>('');
  const [responseHeaders, setResponseHeaders] = useState<
    Record<string, string>
  >({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRaw, setShowRaw] = useState(false);
  const [showHeaders, setShowHeaders] = useState(false);
  const [headers, setHeaders] = useState<Header[]>([
    { id: '1', key: 'Content-Type', value: 'application/json', enabled: true },
  ]);

  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const methodParam = (params as Record<string, string | undefined>).method;
    const encodedUrlParam = (params as Record<string, string | undefined>).url;
    const encodedBodyParam = (params as Record<string, string | undefined>)
      .body;

    try {
      if (methodParam) {
        const method = methodParam.toUpperCase();
        if (availableMethods.includes(method)) {
          setSelectedMethod(method);
        }
      }
      if (encodedUrlParam) {
        const decodedUrl = base64DecodeUtf8(encodedUrlParam);
        setUrl(decodedUrl);
      }
      if (encodedBodyParam) {
        const decodedBody = base64DecodeUtf8(encodedBodyParam);
        setRequestBody(decodedBody);
      }

      const incomingHeaders: Header[] = [];
      for (const [key, value] of searchParams.entries()) {
        const decodedKey = decodeURIComponent(key);
        const decodedValue = decodeURIComponent(value);
        incomingHeaders.push({
          id: uuidv4(),
          key: decodedKey,
          value: decodedValue,
          enabled: true,
        });
      }
      if (incomingHeaders.length) {
        setHeaders(incomingHeaders);
      }
    } catch (error) {
      console.warn('Error decoding URL parameters:', error);
    }
  }, [params, searchParams]);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 text-white">
      <RequestPanel
        selectedMethod={selectedMethod}
        setSelectedMethod={setSelectedMethod}
        url={url}
        setUrl={setUrl}
        loading={loading}
        sendRequest={() =>
          sendRequest({
            user,
            selectedMethod,
            url,
            requestBody,
            responseRaw,
            headers,
            error,
            setLoading,
            setError,
            setResponseData,
            setResponseRaw,
            setResponseHeaders,
            navigate,
            buildShareRoute,
            replaceVariablesInString,
          })
        }
      />

      <HeadersEditor
        headers={headers}
        addHeader={() =>
          setHeaders([
            ...headers,
            { id: uuidv4(), key: '', value: '', enabled: true },
          ])
        }
        updateHeader={(id, field, value) =>
          setHeaders(
            headers.map((header) =>
              header.id === id ? { ...header, [field]: value } : header
            )
          )
        }
        removeHeader={(id) =>
          setHeaders(headers.filter((header) => header.id !== id))
        }
      />

      {['POST', 'PUT', 'PATCH'].includes(selectedMethod) && (
        <RequestBodyEditor
          requestBody={requestBody}
          setRequestBody={setRequestBody}
        />
      )}

      <ResponseView
        loading={loading}
        error={error}
        responseData={responseData}
        responseRaw={responseRaw}
        responseHeaders={responseHeaders}
        showRaw={showRaw}
        setShowRaw={setShowRaw}
        showHeaders={showHeaders}
        setShowHeaders={setShowHeaders}
      />
    </div>
  );
};

async function sendRequest({
  user,
  selectedMethod,
  url,
  requestBody,
  responseRaw,
  headers,
  error,
  setLoading,
  setError,
  setResponseData,
  setResponseRaw,
  setResponseHeaders,
  navigate,
  buildShareRoute,
  replaceVariablesInString,
}: {
  user: User | null | undefined;
  selectedMethod: string;
  url: string;
  requestBody: string;
  responseRaw: string;
  headers: Header[];
  error: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setResponseData: (data: unknown) => void;
  setResponseRaw: (raw: string) => void;
  setResponseHeaders: (headers: Record<string, string>) => void;
  navigate: ReturnType<typeof useNavigate>;
  buildShareRoute: (m: string, u: string, b: string, h: Header[]) => string;
  replaceVariablesInString: (str: string) => string;
}) {
  if (!url) {
    setError('Please enter a URL');
    return;
  }

  setLoading(true);
  setError(null);
  setResponseData(null);
  setResponseRaw('');
  setResponseHeaders({});
  const startTime = Date.now();
  let statusCode = 0;
  let requestSize = 0;
  let responseSize = 0;

  try {
    const originalUrl = replaceVariablesInString(url);
    const thingProxyUrl = 'https://thingproxy.freeboard.io/fetch/';
    const targetUrl = originalUrl.startsWith('http')
      ? originalUrl
      : 'https://' + originalUrl;
    const proxiedUrl = thingProxyUrl + targetUrl;

    const processedRequestBody = replaceVariablesInString(requestBody);
    const rawBody =
      typeof processedRequestBody === 'string'
        ? processedRequestBody
        : JSON.stringify(processedRequestBody);
    requestSize = new TextEncoder().encode(rawBody).length;

    const processedHeaders = headers.map((header) => ({
      ...header,
      key: replaceVariablesInString(header.key),
      value: replaceVariablesInString(header.value),
    }));

    if (targetUrl.length < 2000) {
      const shareRoute = buildShareRoute(
        selectedMethod,
        targetUrl,
        processedRequestBody,
        processedHeaders
      );
      navigate(shareRoute, { replace: false });
    }

    const requestHeaders: Record<string, string> = {};
    headers.forEach((header) => {
      if (header.enabled && header.key && header.value) {
        const processedKey = replaceVariablesInString(header.key);
        const processedValue = replaceVariablesInString(header.value);
        requestHeaders[processedKey] = processedValue;
      }
    });

    let requestBodyData: unknown = undefined;
    if (
      ['POST', 'PUT', 'PATCH'].includes(selectedMethod) &&
      processedRequestBody
    ) {
      try {
        requestBodyData = JSON.parse(processedRequestBody);
      } catch {
        requestBodyData = processedRequestBody;
      }
    }

    const config = {
      method: selectedMethod.toLowerCase(),
      url: proxiedUrl,
      headers: requestHeaders,
      data: requestBodyData,
      timeout: 10000,
      transformResponse: [(data: unknown) => data],
      withCredentials: false,
    };

    const res = await axios(config);
    statusCode = res.status;
    setResponseRaw(res.data);
    setResponseHeaders(res.headers as Record<string, string>);

    const rawResponse =
      typeof res.data === 'string' ? res.data : JSON.stringify(res.data);
    responseSize = new TextEncoder().encode(rawResponse).length;

    try {
      setResponseData(JSON.parse(res.data));
    } catch {
      setResponseData(res.data);
    }
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const error = err as AxiosError;

      statusCode = err.response?.status ?? 0;
      setError(err.message);

      if (error.response?.headers) {
        const headers: Record<string, string> = {};

        for (const [key, value] of Object.entries(error.response.headers)) {
          if (typeof value === 'string') {
            headers[key] = value;
          } else if (Array.isArray(value)) {
            headers[key] = value.join(', ');
          } else if (value !== undefined) {
            headers[key] = String(value);
          }
        }
        setResponseHeaders(headers);
      }
    } else if (err instanceof Error) {
      setError(err.message);
    } else {
      setError('Request failed');
    }
  } finally {
    setLoading(false);
    const duration = Date.now() - startTime;

    const saveHeaders: Record<string, string | boolean> = {};
    headers.forEach(({ id, key, value, enabled }) => {
      if (enabled && key) {
        saveHeaders[key] = value;
      }
    });

    await saveUserRequestHistory({
      userId: user?.uid,
      method: selectedMethod.toLowerCase(),
      url: url,
      headers: saveHeaders,
      body: requestBody,
      requestSize,
      responseSize,
      duration,
      statusCode,
      errorMessage: error,
    });
  }
}

export default RestClient;
