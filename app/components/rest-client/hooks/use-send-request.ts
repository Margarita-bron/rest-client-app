import { useReducer, useCallback } from 'react';
import type { User } from 'firebase/auth';
import { saveUserRequestHistory } from '~/lib/firebase/firebase';
import type { Header } from '~/components/rest-client/rest-client-page';
import type { AppNavigate } from '~/lib/routing/navigation';
import { useAxiosRequest } from './use-axios-request';

type State = {
  loading: boolean;
  error: string | null;
  responseData: unknown;
  responseRaw: string;
  responseHeaders: Record<string, string>;
};

type Action =
  | { type: 'START' }
  | {
      type: 'SUCCESS';
      payload: { data: unknown; raw: string; headers: Record<string, string> };
    }
  | {
      type: 'ERROR';
      payload: { error: string; headers?: Record<string, string> };
    }
  | { type: 'RESET' };

const initialState: State = {
  loading: false,
  error: null,
  responseData: null,
  responseRaw: '',
  responseHeaders: {},
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'START':
      return { ...initialState, loading: true };
    case 'SUCCESS':
      return {
        ...state,
        loading: false,
        error: null,
        responseData: action.payload.data,
        responseRaw: action.payload.raw,
        responseHeaders: action.payload.headers,
      };
    case 'ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        responseHeaders: action.payload.headers ?? {},
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const prepareHeaders = (headers: Header[], replacer: (s: string) => string) =>
  headers.reduce<Record<string, string>>((acc, { enabled, key, value }) => {
    if (enabled && key && value) acc[replacer(key)] = replacer(value);
    return acc;
  }, {});

const prepareBody = (
  method: string,
  body: string,
  replacer: (s: string) => string
) => {
  if (!['POST', 'PUT', 'PATCH'].includes(method)) return undefined;
  const processed = replacer(body);
  try {
    return JSON.parse(processed);
  } catch {
    return processed;
  }
};

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
  const { sendAxiosRequest } = useAxiosRequest();
  const [state, dispatch] = useReducer(reducer, initialState);

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
        dispatch({ type: 'ERROR', payload: { error: 'Please enter a URL' } });
        return {
          data: null,
          error: 'Please enter a URL',
          duration: 0,
          statusCode: 0,
          responseSize: 0,
        };
      }

      dispatch({ type: 'START' });
      const startTime = Date.now();

      let statusCode = 0;
      let requestSize = 0;
      let responseSize = 0;
      let errorMessage: string | null = null;
      let data: unknown = null;

      try {
        const targetUrl = replaceVariablesInString(url);
        const processedRequestBody = replaceVariablesInString(requestBody);
        requestSize = new TextEncoder().encode(processedRequestBody).length;

        if (targetUrl.length < 2000) {
          navigate(
            buildShareRoute(
              selectedMethod,
              targetUrl,
              processedRequestBody,
              headers
            )
          );
        }

        const requestHeaders = prepareHeaders(
          headers,
          replaceVariablesInString
        );
        const body = prepareBody(
          selectedMethod,
          requestBody,
          replaceVariablesInString
        );

        const result = await sendAxiosRequest({
          method: selectedMethod.toLowerCase(),
          url: targetUrl,
          headers: requestHeaders,
          data: body,
          timeout: 10000,
          transformResponse: [(data) => data],
          withCredentials: false,
        });

        statusCode = result.statusCode;
        responseSize = result.responseSize;
        data = result.data;

        dispatch({
          type: 'SUCCESS',
          payload: {
            data: result.data,
            raw: result.rawResponse,
            headers: result.headers,
          },
        });
      } catch (err: unknown) {
        if (err && typeof err === 'object') {
          const e = err as {
            statusCode?: number;
            message?: string;
            headers?: Record<string, string>;
          };
          statusCode = e.statusCode ?? 0;
          errorMessage = e.message ?? 'Request failed';
          dispatch({
            type: 'ERROR',
            payload: { error: errorMessage, headers: e.headers },
          });
        } else {
          errorMessage = 'Unexpected error';
          dispatch({ type: 'ERROR', payload: { error: errorMessage } });
        }
      } finally {
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
            errorMessage,
          });
        }

        return {
          data,
          error: errorMessage,
          duration,
          statusCode,
          responseSize,
        };
      }
    },
    [
      user,
      buildShareRoute,
      replaceVariablesInString,
      navigate,
      sendAxiosRequest,
    ]
  );

  return { ...state, sendRequest, reset: () => dispatch({ type: 'RESET' }) };
};
