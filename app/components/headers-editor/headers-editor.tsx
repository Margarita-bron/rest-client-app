import type { Header } from '~/routes/rest-client';

type HeadersEditorProps = {
  headers: Header[];
  addHeader: () => void;
  updateHeader: (id: string, field: 'key' | 'value' | 'enabled', value: string | boolean) => void;
  removeHeader: (id: string) => void;
}

const HeadersEditor = ({
                         headers,
                         addHeader,
                         updateHeader,
                         removeHeader
                       }: HeadersEditorProps) => {
  return (
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
  );
};

export default HeadersEditor;