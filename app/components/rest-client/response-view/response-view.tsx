type ResponseViewProps = {
  loading: boolean;
  error: string | null;
  responseData: any;
  responseRaw: string;
  responseHeaders: Record<string, string>;
  showRaw: boolean;
  setShowRaw: (show: boolean) => void;
  showHeaders: boolean;
  setShowHeaders: (show: boolean) => void;
}

const ResponseView = ({
                        loading,
                        error,
                        responseData,
                        responseRaw,
                        responseHeaders,
                        showRaw,
                        setShowRaw,
                        showHeaders,
                        setShowHeaders
                      }: ResponseViewProps) => {
  const formatHeaders = (headers: Record<string, string>) => {
    return Object.entries(headers)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
  };

  return (
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
        <div className="w-full text-left">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <h3 className="text-lg font-semibold m-0 text-white">Response:</h3>
            <div className="flex gap-2 ">
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
              <pre className="text-left bg-gray-800 p-4 border border-gray-700 rounded-md overflow-auto max-h-48 text-sm font-mono text-gray-200">
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
  );
};

export default ResponseView;