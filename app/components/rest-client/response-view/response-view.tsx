import { useTr } from '~/lib/i18n/hooks/use-translate-custom';
import { Loader } from '~/ui/loader';
import SpaceStationImg from '~/assets/space-station.png';

type ResponseViewProps = {
  loading: boolean;
  error: string | null;
  responseData: unknown;
  responseRaw: string;
  responseHeaders: Record<string, string>;
  responseSize?: number;
  statusCode?: number;
  showRaw: boolean;
  setShowRaw: (show: boolean) => void;
  showHeaders: boolean;
  setShowHeaders: (show: boolean) => void;
};

const ResponseView = ({
  loading,
  error,
  responseData,
  responseRaw,
  responseHeaders,
  responseSize,
  statusCode,
  showRaw,
  setShowRaw,
  showHeaders,
  setShowHeaders,
}: ResponseViewProps) => {
  const t = useTr('responseView');

  const formatHeaders = (headers: Record<string, string>) =>
    Object.entries(headers)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');

  const hasResponse =
    responseData ||
    responseRaw ||
    Object.keys(responseHeaders).length > 0 ||
    statusCode !== undefined;

  return (
    <div className="w-full mt-4">
      <div className="w-full text-left">
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <h3 className="text-lg font-semibold m-0 text-white">{t('title')}</h3>

          {(statusCode || responseSize) && (
            <div className="flex gap-4 text-sm text-gray-300">
              {statusCode !== undefined && (
                <div>
                  {t('status')}: {statusCode}
                </div>
              )}
              {responseSize !== undefined && (
                <div>
                  {t('size')}: {responseSize} B
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => setShowRaw(!showRaw)}
              disabled={!hasResponse}
              className={`px-3 py-1 text-sm border rounded-md transition-colors ${
                showRaw
                  ? 'bg-gray-600 border-gray-500 text-white'
                  : 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
              } ${!hasResponse ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {showRaw ? t('showJson') : t('showRaw')}
            </button>
            <button
              onClick={() => setShowHeaders(!showHeaders)}
              disabled={!hasResponse}
              className={`px-3 py-1 text-sm border rounded-md transition-colors ${
                showHeaders
                  ? 'bg-gray-600 border-gray-500 text-white'
                  : 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
              } ${!hasResponse ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {showHeaders ? t('hideHeaders') : t('showHeaders')}
            </button>
          </div>
        </div>

        {showHeaders && Object.keys(responseHeaders).length > 0 && (
          <div className="mb-4">
            <h4 className="text-md font-semibold mb-2 text-white">
              {t('headersTitle')}
            </h4>
            <pre className="text-left bg-gray-800 p-4 border border-gray-700 rounded-md overflow-auto max-h-48 text-sm font-mono text-gray-200">
              {formatHeaders(responseHeaders)}
            </pre>
          </div>
        )}

        <pre
          className={`p-4 border border-gray-700 rounded-md overflow-auto min-h-96 max-h-96 text-sm w-full box-border font-mono text-gray-200 ${
            hasResponse
              ? 'bg-gray-800'
              : loading
                ? 'bg-gray-950 flex items-center justify-center'
                : 'bg-gray-900 flex items-center justify-center'
          } ${showRaw ? 'whitespace-pre-wrap' : ''}`}
        >
          {loading ? (
            <div className="flex items-center justify-center w-full h-full">
              <Loader />
            </div>
          ) : hasResponse ? (
            showRaw ? (
              responseRaw
            ) : (
              JSON.stringify(responseData, null, 2)
            )
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <img
                src={SpaceStationImg}
                alt="No response"
                className="mb-2 max-h-32"
              />
              <span className="text-xs text-gray-500 text-center">
                {t('sendRequestToSeeResponse') ||
                  'To get response body, send a request'}
              </span>
            </div>
          )}
        </pre>
      </div>

      {error && (
        <div className="p-4 bg-red-900/20 border border-red-700 rounded-md text-red-300 mt-4 w-full">
          {t('error', { message: error })}
        </div>
      )}
    </div>
  );
};

export default ResponseView;
