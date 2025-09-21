import { useCallback } from 'react';
import axios, { AxiosError, type AxiosRequestConfig } from 'axios';

export type AxiosRequestResult = {
  statusCode: number;
  rawResponse: string;
  data: unknown;
  headers: Record<string, string>;
  responseSize: number;
};

export const useAxiosRequest = () => {
  const sendAxiosRequest = useCallback(
    async (config: AxiosRequestConfig): Promise<AxiosRequestResult> => {
      try {
        const res = await axios.request(config);
        const rawResponse =
          typeof res.data === 'string' ? res.data : JSON.stringify(res.data);

        const headers: Record<string, string> = {};
        Object.entries(res.headers).forEach(([key, value]) => {
          if (typeof value === 'string') headers[key] = value;
          else if (Array.isArray(value)) headers[key] = value.join(', ');
          else if (value !== undefined) headers[key] = String(value);
        });

        return {
          statusCode: res.status,
          rawResponse,
          data: (() => {
            try {
              return JSON.parse(rawResponse);
            } catch {
              return res.data;
            }
          })(),
          headers,
          responseSize: new TextEncoder().encode(rawResponse).length,
        };
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const error = err as AxiosError;
          const headers: Record<string, string> = {};

          if (error.response?.headers) {
            Object.entries(error.response.headers).forEach(([key, value]) => {
              if (typeof value === 'string') headers[key] = value;
              else if (Array.isArray(value)) headers[key] = value.join(', ');
              else if (value !== undefined) headers[key] = String(value);
            });
          }

          throw {
            statusCode: error.response?.status ?? 0,
            message: error.message,
            headers,
          };
        }
        if (err instanceof Error) {
          throw { statusCode: 0, message: err.message, headers: {} };
        }
        throw { statusCode: 0, message: 'Request failed', headers: {} };
      }
    },
    []
  );

  return { sendAxiosRequest };
};
