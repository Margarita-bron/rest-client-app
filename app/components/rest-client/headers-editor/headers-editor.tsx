import { REST_CLIENT_IDS } from '~/components/rest-client/rest-client-test-ids';
import type { Header } from '~/components/rest-client/rest-client-page';
import { useTr } from '~/lib/i18n/hooks/use-translate-custom';

type HeadersEditorProps = {
  headers: Header[];
  addHeader: () => void;
  updateHeader: (
    id: string,
    field: 'key' | 'value' | 'enabled',
    value: string | boolean
  ) => void;
  removeHeader: (id: string) => void;
};

const HeadersEditor = ({
  headers,
  addHeader,
  updateHeader,
  removeHeader,
}: HeadersEditorProps) => {
  const t = useTr('headersEditor');

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3
          data-testid={REST_CLIENT_IDS.headersEditor.title}
          className="text-lg font-semibold text-white"
        >
          {t('title')}
        </h3>
        <button
          data-testid={REST_CLIENT_IDS.headersEditor.addButton}
          onClick={addHeader}
          className="px-3 py-1 bg-green-600 text-white rounded-md text-sm cursor-pointer hover:bg-green-700"
        >
          {t('addButton')}
        </button>
      </div>

      <div className="space-y-2">
        {headers.map((header) => (
          <div key={header.id} className="flex items-center gap-2">
            <input
              data-testid={REST_CLIENT_IDS.headersEditor.headerEnabledCheckbox(
                header.id
              )}
              type="checkbox"
              checked={header.enabled}
              onChange={(e) =>
                updateHeader(header.id, 'enabled', e.target.checked)
              }
              className="ml-2 accent-blue-500"
            />
            <input
              data-testid={REST_CLIENT_IDS.headersEditor.headerKeyInput(
                header.id
              )}
              placeholder={t('headerNamePlaceholder')}
              value={header.key}
              onChange={(e) => updateHeader(header.id, 'key', e.target.value)}
              className="flex-1 px-2 py-1 border border-gray-600 rounded-md bg-gray-700 text-white text-sm"
            />
            <input
              data-testid={REST_CLIENT_IDS.headersEditor.headerValueInput(
                header.id
              )}
              placeholder={t('headerValuePlaceholder')}
              value={header.value}
              onChange={(e) => updateHeader(header.id, 'value', e.target.value)}
              className="flex-1 px-2 py-1 border border-gray-600 rounded-md bg-gray-700 text-white text-sm"
            />
            <button
              data-testid={REST_CLIENT_IDS.headersEditor.removeButton(
                header.id
              )}
              onClick={() => removeHeader(header.id)}
              className="px-2 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
            >
              {t('removeButton')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeadersEditor;
