import { useState, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import type { User } from 'firebase/auth';
import { saveUserRequestHistory } from '~/lib/firebase/firebase';
import type { Header } from '~/routes/rest-client';
import type { AppNavigate } from '~/lib/routing/navigation';

export const useSendRequest = ({
  user,
  buildShareRoute,
  replaceVariablesInString,
  navigate,
}: {
  user: User | null;
  buildShareRoute: (
    method: string,
    url: string,
    body: string,
    headers: Header[]
  ) => string;
  replaceVariablesInString: (str: string) => string;
  navigate: AppNavigate;
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [responseData, setResponseData] = useState<unknown>(null);
  const [responseRaw, setResponseRaw] = useState('');
  const [responseHeaders, setResponseHeaders] = useState<
    Record<string, string>
  >({});

  const sendRequest = useCallback(
    async ({
      selectedMethod,
      url,
      requestBody,
      headers,
    }: {
      selectedMethod: string;
      url: string;
      requestBody: string;
      headers: Header[];
    }) => {
      if (!url) {
        setError('Please enter a URL');
        return;
      }

      setLoading(true);
      setError(null);
      setResponseData(null);
      setResponseRaw('');
      setResponseHeaders({});
      const startTime = Date.now();
      let statusCode = 0;
      let requestSize = 0;
      let responseSize = 0;

      try {
        const targetUrl = replaceVariablesInString(url);

        const processedRequestBody = replaceVariablesInString(requestBody);
        const rawBody =
          typeof processedRequestBody === 'string'
            ? processedRequestBody
            : JSON.stringify(processedRequestBody);
        requestSize = new TextEncoder().encode(rawBody).length;

        const processedHeaders = headers.map((header) => ({
          ...header,
          key: replaceVariablesInString(header.key),
          value: replaceVariablesInString(header.value),
        }));

        if (targetUrl.length < 2000) {
          const shareRoute = buildShareRoute(
            selectedMethod,
            targetUrl,
            processedRequestBody,
            processedHeaders
          );
          navigate(shareRoute);
        }

        const requestHeaders: Record<string, string> = {};
        headers.forEach((header) => {
          if (header.enabled && header.key && header.value) {
            requestHeaders[replaceVariablesInString(header.key)] =
              replaceVariablesInString(header.value);
          }
        });

        let requestBodyData: unknown = undefined;
        if (
          ['POST', 'PUT', 'PATCH'].includes(selectedMethod) &&
          processedRequestBody
        ) {
          try {
            requestBodyData = JSON.parse(processedRequestBody);
          } catch {
            requestBodyData = processedRequestBody;
          }
        }

        const config = {
          method: selectedMethod.toLowerCase(),
          url: targetUrl,
          headers: requestHeaders,
          data: requestBodyData,
          timeout: 10000,
          transformResponse: [(data: unknown) => data],
          withCredentials: false,
        };

        const res = await axios(config);
        statusCode = res.status;
        setResponseRaw(res.data);
        setResponseHeaders(res.headers as Record<string, string>);

        const rawResponse =
          typeof res.data === 'string' ? res.data : JSON.stringify(res.data);
        responseSize = new TextEncoder().encode(rawResponse).length;

        try {
          setResponseData(JSON.parse(res.data));
        } catch {
          setResponseData(res.data);
        }
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          const error = err as AxiosError;
          statusCode = err.response?.status ?? 0;
          setError(err.message);

          if (error.response?.headers) {
            const headers: Record<string, string> = {};
            for (const [key, value] of Object.entries(error.response.headers)) {
              if (typeof value === 'string') headers[key] = value;
              else if (Array.isArray(value)) headers[key] = value.join(', ');
              else if (value !== undefined) headers[key] = String(value);
            }
            setResponseHeaders(headers);
          }
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Request failed');
        }
      } finally {
        setLoading(false);
        const duration = Date.now() - startTime;

        const saveHeaders: Record<string, string | boolean> = {};
        headers.forEach(({ key, value, enabled }) => {
          if (enabled && key) saveHeaders[key] = value;
        });

        if (user?.uid) {
          await saveUserRequestHistory(user.uid, {
            method: selectedMethod.toLowerCase(),
            url,
            headers: saveHeaders,
            body: requestBody,
            requestSize,
            responseSize,
            duration,
            statusCode,
            errorMessage: error,
          });
        }
      }
    },
    [user, buildShareRoute, replaceVariablesInString, navigate]
  );

  return {
    sendRequest,
    loading,
    error,
    responseData,
    responseRaw,
    responseHeaders,
  };
};
