import { REST_CLIENT_IDS } from '~/components/rest-client/rest-client-test-ids';
import { useTr } from '~/lib/i18n/hooks/use-translate-custom';

type RequestBodyEditorProps = {
  requestBody: string;
  setRequestBody: (body: string) => void;
};

const RequestBodyEditor = ({
  requestBody,
  setRequestBody,
}: RequestBodyEditorProps) => {
  const t = useTr('requestBodyEditor');

  return (
    <div className="mb-4">
      <h3
        data-testid={REST_CLIENT_IDS.requestBodyEditor.title}
        className="text-lg font-semibold mb-2 text-white"
      >
        {t('title')}
      </h3>
      <textarea
        data-testid={REST_CLIENT_IDS.requestBodyEditor.textarea}
        value={requestBody}
        onChange={(e) => setRequestBody(e.target.value)}
        placeholder={t('placeholder')}
        rows={6}
        className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
      />
    </div>
  );
};

export default RequestBodyEditor;
