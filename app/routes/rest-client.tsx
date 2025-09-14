import { type ChangeEvent, useState } from 'react';
import axios from 'axios';

interface Header {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

const RestClient = () => {
  const [selectedValue, setSelectedValue] = useState('GET');
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

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(event.target.value);
  };

  const addHeader = () => {
    setHeaders([...headers, { id: Date.now().toString(), key: '', value: '', enabled: true }]);
  };

  const updateHeader = (id: string, field: 'key' | 'value' | 'enabled', value: string | boolean) => {
    setHeaders(headers.map(header =>
      header.id === id ? { ...header, [field]: value } : header
    ));
  };

  const removeHeader = (id: string) => {
    setHeaders(headers.filter(header => header.id !== id));
  };
  const sendRequest = async () => {
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
        setUrl(targetUrl);
      }

      const urlObj = new URL(targetUrl);
      const apiPath = urlObj.pathname + urlObj.search;


      const requestHeaders: Record<string, string> = {
        'X-Target-URL': urlObj.origin
      };


      headers.forEach(header => {
        if (header.enabled && header.key && header.value) {
          requestHeaders[header.key] = header.value;
        }
      });


      let requestBodyData: any = undefined;
      if (['POST', 'PUT', 'PATCH'].includes(selectedValue) && requestBody) {
        try {
          requestBodyData = JSON.parse(requestBody);
        } catch {
          requestBodyData = requestBody;
        }
      }

      const config = {
        method: selectedValue.toLowerCase(),
        url: `/proxy${apiPath}`,
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
  };

  const formatHeaders = (headers: Record<string, string>) => {
    return Object.entries(headers)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 text-white">
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <select
          value={selectedValue}
          onChange={handleChange}
          className="px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="PATCH">PATCH</option>
          <option value="DELETE">DELETE</option>
          <option value="HEAD">HEAD</option>
          <option value="OPTIONS">OPTIONS</option>
        </select>

        <input
          placeholder="Enter URL (e.g., jsonplaceholder.typicode.com/posts)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 min-w-[200px] px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={sendRequest}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Loading...' : 'Send'}
        </button>
      </div>

      {/* Headers Editor */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-white">Headers</h3>
          <button
            onClick={addHeader}
            className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
          >
            + Add Header
          </button>
        </div>

        <div className="space-y-2">
          {headers.map((header) => (
            <div key={header.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={header.enabled}
                onChange={(e) => updateHeader(header.id, 'enabled', e.target.checked)}
                className="ml-2 accent-blue-500"
              />
              <input
                placeholder="Header name"
                value={header.key}
                onChange={(e) => updateHeader(header.id, 'key', e.target.value)}
                className="flex-1 px-2 py-1 border border-gray-600 rounded-md bg-gray-700 text-white text-sm"
              />
              <input
                placeholder="Header value"
                value={header.value}
                onChange={(e) => updateHeader(header.id, 'value', e.target.value)}
                className="flex-1 px-2 py-1 border border-gray-600 rounded-md bg-gray-700 text-white text-sm"
              />
              <button
                onClick={() => removeHeader(header.id)}
                className="px-2 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>


      {['POST', 'PUT', 'PATCH'].includes(selectedValue) && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2 text-white">Request Body</h3>
          <textarea
            value={requestBody}
            onChange={(e) => setRequestBody(e.target.value)}
            placeholder='{"key": "value"}'
            rows={6}
            className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          />
        </div>
      )}


      <div className="w-full">
        {loading && (
          <div className="py-5 text-center text-gray-400 w-full">
            Loading...
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-900/20 border border-red-700 rounded-md text-red-300 mb-4 w-full">
            Error: {error}
          </div>
        )}

        {(responseData || responseRaw || Object.keys(responseHeaders).length > 0) && !loading && (
          <div className="w-full">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <h3 className="text-lg font-semibold m-0 text-white">Response:</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowRaw(!showRaw)}
                  className={`px-3 py-1 text-sm border rounded-md transition-colors ${
                    showRaw
                      ? 'bg-gray-600 border-gray-500 text-white'
                      : 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
                  }`}
                >
                  {showRaw ? 'Show JSON' : 'Show Raw'}
                </button>
                <button
                  onClick={() => setShowHeaders(!showHeaders)}
                  className={`px-3 py-1 text-sm border rounded-md transition-colors ${
                    showHeaders
                      ? 'bg-gray-600 border-gray-500 text-white'
                      : 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
                  }`}
                >
                  {showHeaders ? 'Hide Headers' : 'Show Headers'}
                </button>
              </div>
            </div>

            {showHeaders && (
              <div className="mb-4">
                <h4 className="text-md font-semibold mb-2 text-white">Response Headers:</h4>
                <pre className="bg-gray-800 p-4 border border-gray-700 rounded-md overflow-auto max-h-48 text-sm font-mono text-gray-200">
                  {formatHeaders(responseHeaders)}
                </pre>
              </div>
            )}

            <pre className={`bg-gray-800 p-4 border border-gray-700 rounded-md overflow-auto max-h-96 text-sm w-full box-border font-mono text-gray-200 ${
              showRaw ? 'whitespace-pre-wrap' : ''
            }`}>
              {showRaw ? responseRaw : JSON.stringify(responseData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestClient;