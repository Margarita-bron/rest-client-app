import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { v4 as uuidv4 } from 'uuid';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from '~/lib/routing/navigation';
import RequestPanel from './request-panel/request-panel';
import HeadersEditor from './headers-editor/headers-editor';
import RequestBodyEditor from './request-body-editor/request-body-editor';
import ResponseView from './response-view/response-view';
import { auth, saveUserRequestHistory } from '~/lib/firebase/firebase';
import {
  buildShareRoute,
  parseRequestFromUrl,
} from '~/lib/routing/rest-client-path';
import { useVariables } from '~/hooks/use-variables';
import { useSendRequest } from '~/components/rest-client/hooks/useSendRequest';
import type { User } from 'firebase/auth';
import { replaceVariablesInRequest } from '~/components/rest-client/replaceVariablesInRequest';

export type Header = {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
};

const RestClientPage = () => {
  const [user] = useAuthState(auth) as [User | null, boolean, unknown];
  const { variables } = useVariables();
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
    replaceVariablesInString: (str) => {
      if (!str) return str;
      let result = str;
      variables
        .filter((v) => v.enabled && v.key)
        .forEach((v) => {
          const pattern = new RegExp(`{{${v.key}}}`, 'g');
          result = result.replace(pattern, v.value);
        });
      return result;
    },
    navigate,
  });

  const params = useParams();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const {
      method,
      url: templateUrl,
      body: templateBody,
      headers: incomingHeaders,
    } = parseRequestFromUrl(
      params as Record<string, string | undefined>,
      searchParams
    );

    setSelectedMethod(method);

    setUrl((prev) => prev || templateUrl);

    setRequestBody((prev) => prev || templateBody);
    if (incomingHeaders.length) setHeaders(incomingHeaders);
  }, [params, searchParams]);

  const onSend = async () => {
    if (!user) return;

    const originalUrl = url;
    const originalBody = requestBody;
    const originalHeaders: Header[] = headers.map((h) => ({ ...h }));

    await saveUserRequestHistory(user.uid, {
      method: selectedMethod,
      url: originalUrl,
      body: originalBody,
      headers: originalHeaders.reduce<Record<string, string | boolean>>(
        (acc, h) => {
          if (h.key) acc[h.key] = h.enabled ? h.value : false;
          return acc;
        },
        {}
      ),
      requestSize: originalBody.length,
      responseSize: 0,
      duration: 0,
      statusCode: 0,
      errorMessage: '',
    });

    navigate(
      buildShareRoute(
        selectedMethod,
        originalUrl,
        originalBody,
        originalHeaders
      )
    );

    const replaced = replaceVariablesInRequest(
      originalUrl,
      originalBody,
      originalHeaders,
      variables
    );

    const {
      data,
      error: reqError,
      duration,
      statusCode,
      responseSize,
    } = await sendRequest({
      selectedMethod,
      url: replaced.url,
      requestBody: replaced.body,
      headers: replaced.headers,
    });

    await saveUserRequestHistory(user.uid, {
      method: selectedMethod,
      url: originalUrl,
      body: originalBody,
      headers: originalHeaders.reduce<Record<string, string | boolean>>(
        (acc, h) => {
          if (h.key) acc[h.key] = h.enabled ? h.value : false;
          return acc;
        },
        {}
      ),
      requestSize: originalBody.length,
      responseSize: responseSize || 0,
      duration: duration || 0,
      statusCode: statusCode || 0,
      errorMessage: reqError ? String(reqError) : '',
    });
  };

  return (
    <div className=" my-10 w-full max-w-7xl mx-auto p-8 text-white border-1 border-gray-800 rounded-2xl">
      <RequestPanel
        selectedMethod={selectedMethod}
        setSelectedMethod={setSelectedMethod}
        url={url}
        setUrl={setUrl}
        loading={loading}
        onSend={onSend}
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

export default RestClientPage;
