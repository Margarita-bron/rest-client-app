import { useState } from 'react';
import RequestPanel from '../components/rest-client/request-panel/request-panel';
import HeadersEditor from '../components/rest-client/headers-editor/headers-editor';
import RequestBodyEditor from '../components/rest-client/request-body-editor/request-body-editor';
import ResponseView from '../components/rest-client/response-view/response-view';
import axios, { AxiosError } from 'axios';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, saveUserRequestHistory } from '~/lib/firebase/firebase';
import type { User } from 'firebase/auth';

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
          })
        }
      />

      <HeadersEditor
        headers={headers}
        addHeader={() =>
          setHeaders([
            ...headers,
            { id: Date.now().toString(), key: '', value: '', enabled: true },
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

  try {
    let targetUrl = url;
    if (!url.startsWith('http')) {
      targetUrl = 'https://' + url;
    }

    const urlObj = new URL(targetUrl);

    const requestHeaders: Record<string, string> = {};

    headers.forEach((header) => {
      if (header.enabled && header.key && header.value) {
        requestHeaders[header.key] = header.value;
      }
    });

    let requestBodyData: unknown = undefined;
    if (['POST', 'PUT', 'PATCH'].includes(selectedMethod) && requestBody) {
      try {
        requestBodyData = JSON.parse(requestBody);
      } catch {
        requestBodyData = requestBody;
      }
    }

    const config = {
      method: selectedMethod.toLowerCase(),
      url: targetUrl,
      headers: requestHeaders,
      data: requestBodyData,
      timeout: 10000,
      transformResponse: [(data: unknown) => data],
    };

    const res = await axios(config);
    statusCode = res.status;
    setResponseRaw(res.data);
    setResponseHeaders(res.headers as Record<string, string>);

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
    const rawBody =
      typeof requestBody === 'string'
        ? requestBody
        : JSON.stringify(requestBody);
    const requestSize = new TextEncoder().encode(rawBody).length;

    const rawResponse =
      typeof responseRaw === 'string'
        ? responseRaw
        : JSON.stringify(responseRaw);
    const responseSize = new TextEncoder().encode(rawResponse).length;

    await saveUserRequestHistory(user?.uid!, {
      method: selectedMethod.toLowerCase(),
      url,
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
