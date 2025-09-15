import { useState } from 'react';
import RequestPanel from '../components/request-panel/request-panel';
import HeadersEditor from '../components/headers-editor/headers-editor';
import RequestBodyEditor from '../components/request-body-editor/request-body-editor';
import ResponseView from '../components/response-view/response-view';
import axios from 'axios';

export interface Header {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

const RestClient = () => {
  const [selectedMethod, setSelectedMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [requestBody, setRequestBody] = useState('');
  const [responseData, setResponseData] = useState<any>(null);
  const [responseRaw, setResponseRaw] = useState<string>('');
  const [responseHeaders, setResponseHeaders] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRaw, setShowRaw] = useState(false);
  const [showHeaders, setShowHeaders] = useState(false);
  const [headers, setHeaders] = useState<Header[]>([
    { id: '1', key: 'Content-Type', value: 'application/json', enabled: true }
  ]);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 text-white">
      <RequestPanel
        selectedMethod={selectedMethod}
        setSelectedMethod={setSelectedMethod}
        url={url}
        setUrl={setUrl}
        loading={loading}
        sendRequest={() => sendRequest({
          selectedMethod,
          url,
          requestBody,
          headers,
          setLoading,
          setError,
          setResponseData,
          setResponseRaw,
          setResponseHeaders
        })}
      />

      <HeadersEditor
        headers={headers}
        addHeader={() => setHeaders([...headers, { id: Date.now().toString(), key: '', value: '', enabled: true }])}
        updateHeader={(id, field, value) =>
          setHeaders(headers.map(header =>
            header.id === id ? { ...header, [field]: value } : header
          ))
        }
        removeHeader={(id) => setHeaders(headers.filter(header => header.id !== id))}
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
                             selectedMethod,
                             url,
                             requestBody,
                             headers,
                             setLoading,
                             setError,
                             setResponseData,
                             setResponseRaw,
                             setResponseHeaders
                           }: {
  selectedMethod: string;
  url: string;
  requestBody: string;
  headers: Header[];
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setResponseData: (data: any) => void;
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

  try {
    let targetUrl = url;
    if (!url.startsWith('http')) {
      targetUrl = 'https://' + url;
    }

    const urlObj = new URL(targetUrl);


    const requestHeaders: Record<string, string> = {
      'X-Target-URL': urlObj.origin
    };

    headers.forEach(header => {
      if (header.enabled && header.key && header.value) {
        requestHeaders[header.key] = header.value;
      }
    });

    let requestBodyData: any = undefined;
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
      transformResponse: [(data: any) => data]
    };

    const res = await axios(config);
    setResponseRaw(res.data);
    setResponseHeaders(res.headers as Record<string, string>);

    try {
      setResponseData(JSON.parse(res.data));
    } catch {
      setResponseData(res.data);
    }

  } catch (err: any) {
    const errorMessage = err.response?.data?.message || err.message || 'Request failed';
    setError(errorMessage);

    if (err.response?.headers) {
      setResponseHeaders(err.response.headers);
    }
  } finally {
    setLoading(false);
  }
}

export default RestClient;