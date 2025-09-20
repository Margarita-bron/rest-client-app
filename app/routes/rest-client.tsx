import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { v4 as uuidv4 } from 'uuid';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from '~/lib/routing/navigation';
import RequestPanel from '../components/rest-client/request-panel/request-panel';
import HeadersEditor from '../components/rest-client/headers-editor/headers-editor';
import RequestBodyEditor from '../components/rest-client/request-body-editor/request-body-editor';
import ResponseView from '../components/rest-client/response-view/response-view';
import { auth } from '~/lib/firebase/firebase';
import {
  buildShareRoute,
  parseRequestFromUrl,
} from '~/lib/routing/rest-client-path';
import { useVariables } from '~/hooks/use-variables';
import { useSendRequest } from '~/components/rest-client/hooks/useSendRequest';
import type { User } from 'firebase/auth';

export type Header = {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
};

const RestClient = () => {
  const [user] = useAuthState(auth) as [User | null, boolean, unknown];
  const { replaceVariablesInString } = useVariables();
  const { navigate } = useRouter();

  const [selectedMethod, setSelectedMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [requestBody, setRequestBody] = useState('');
  const [headers, setHeaders] = useState<Header[]>([
    { id: '1', key: 'Content-Type', value: 'application/json', enabled: true },
  ]);

  const [showRaw, setShowRaw] = useState(false);
  const [showHeaders, setShowHeaders] = useState(false);

  const {
    sendRequest,
    loading,
    error,
    responseData,
    responseRaw,
    responseHeaders,
  } = useSendRequest({
    user,
    buildShareRoute,
    replaceVariablesInString,
    navigate,
  });

  const params = useParams();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const {
      method,
      url: decodedUrl,
      body: decodedBody,
      headers: incomingHeaders,
    } = parseRequestFromUrl(
      params as Record<string, string | undefined>,
      searchParams
    );

    setSelectedMethod(method);
    setUrl(decodedUrl);
    setRequestBody(decodedBody);
    if (incomingHeaders.length) setHeaders(incomingHeaders);
  }, [params, searchParams]);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 text-white">
      <RequestPanel
        selectedMethod={selectedMethod}
        setSelectedMethod={setSelectedMethod}
        url={url}
        setUrl={setUrl}
        loading={loading}
        onSend={() =>
          sendRequest({ selectedMethod, url, requestBody, headers })
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
            headers.map((h) => (h.id === id ? { ...h, [field]: value } : h))
          )
        }
        removeHeader={(id) => setHeaders(headers.filter((h) => h.id !== id))}
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

export default RestClient;
