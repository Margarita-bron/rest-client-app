import { type ChangeEvent } from 'react';
import { availableMethods } from '~/constants/rest-client';
import { useTr } from '~/lib/i18n/hooks/use-translate-custom';

type RequestPanelProps = {
  selectedMethod: string;
  setSelectedMethod: (method: string) => void;
  url: string;
  setUrl: (url: string) => void;
  loading: boolean;
  sendRequest: () => void;
};

const RequestPanel = ({
  selectedMethod,
  setSelectedMethod,
  url,
  setUrl,
  loading,
  sendRequest,
}: RequestPanelProps) => {
  const t = useTr('requestPanel');

  const handleMethodChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedMethod(event.target.value);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-5">
      <select
        value={selectedMethod}
        onChange={handleMethodChange}
        className="px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {availableMethods.map((item) => (
          <option value={item}>{item}</option>
        ))}
      </select>

      <input
        placeholder={t('placeholder')}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="flex-1 min-w-[200px] px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={sendRequest}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? t('loading') : t('send')}
      </button>
    </div>
  );
};

export default RequestPanel;
