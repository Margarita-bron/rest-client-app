import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import axios, { AxiosError } from 'axios';
import {
  useAxiosRequest,
  type AxiosRequestResult,
} from '~/components/rest-client/hooks/use-axios-request';

describe('useAxiosRequest (logic only)', () => {
  it('transforms successful string response correctly', async () => {
    const response = {
      status: 200,
      data: 'plain text',
      headers: { 'x-custom': 'value' },
    };
    const requestMock = vi.spyOn(axios, 'request').mockResolvedValue(response);

    const { result } = renderHook(() => useAxiosRequest());
    const send = result.current.sendAxiosRequest;

    const res: AxiosRequestResult = await send({ url: '/test', method: 'GET' });

    expect(res.data).toBe('plain text');
    expect(res.rawResponse).toBe('plain text');
    expect(res.headers).toEqual({ 'x-custom': 'value' });
    expect(res.responseSize).toBeGreaterThan(0);

    requestMock.mockRestore();
  });

  it('transforms successful JSON response correctly', async () => {
    const response = {
      status: 200,
      data: { foo: 'bar' },
      headers: { 'x-array': ['a', 'b'] },
    };
    const requestMock = vi.spyOn(axios, 'request').mockResolvedValue(response);

    const { result } = renderHook(() => useAxiosRequest());
    const send = result.current.sendAxiosRequest;

    const res: AxiosRequestResult = await send({ url: '/json', method: 'GET' });

    expect(res.data).toEqual({ foo: 'bar' });
    expect(res.rawResponse).toBe(JSON.stringify({ foo: 'bar' }));
    expect(res.headers['x-array']).toBe('a, b');
    expect(res.responseSize).toBeGreaterThan(0);

    requestMock.mockRestore();
  });

  it('transforms axios error correctly', async () => {
    const axiosError = {
      isAxiosError: true,
      message: 'Not Found',
      response: {
        status: 404,
        headers: { 'x-test': ['x', 'y'] },
        data: {},
        config: {},
        statusText: 'Not Found',
      },
      toJSON: () => ({}),
    } as unknown as AxiosError;

    const requestMock = vi
      .spyOn(axios, 'request')
      .mockRejectedValue(axiosError);

    const { result } = renderHook(() => useAxiosRequest());
    const send = result.current.sendAxiosRequest;

    await expect(send({ url: '/fail', method: 'GET' })).rejects.toMatchObject({
      statusCode: 404,
      message: 'Not Found',
      headers: { 'x-test': 'x, y' },
    });

    requestMock.mockRestore();
  });

  it('transforms generic error correctly', async () => {
    const genericError = new Error('Oops');
    const requestMock = vi
      .spyOn(axios, 'request')
      .mockRejectedValue(genericError);

    const { result } = renderHook(() => useAxiosRequest());
    const send = result.current.sendAxiosRequest;

    await expect(send({ url: '/error', method: 'GET' })).rejects.toMatchObject({
      statusCode: 0,
      message: 'Oops',
      headers: {},
    });

    requestMock.mockRestore();
  });
});
