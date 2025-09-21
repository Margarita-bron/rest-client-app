import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSendRequest } from '~/components/rest-client/hooks/use-send-request';
import * as axiosHook from '~/components/rest-client/hooks/use-axios-request';
import * as firebase from '~/lib/firebase/firebase';
import type { User } from 'firebase/auth';
import type { Header } from '~/components/rest-client/rest-client-page';

describe('useSendRequest', () => {
  const mockUser: User = { uid: 'user1' } as User;
  const mockNavigate = vi.fn();
  const mockBuildShareRoute = vi.fn(() => '/share/GET');
  const mockReplaceVariablesInString = vi.fn((s: string) => s);

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(firebase, 'saveUserRequestHistory').mockResolvedValue();
  });

  it('returns error if URL is empty', async () => {
    const { result } = renderHook(() =>
      useSendRequest({
        user: mockUser,
        buildShareRoute: mockBuildShareRoute,
        replaceVariablesInString: mockReplaceVariablesInString,
        navigate: mockNavigate,
      })
    );

    const res = await result.current.sendRequest({
      selectedMethod: 'GET',
      url: '',
      requestBody: '',
      headers: [],
    });

    expect(res.error).toBe('Please enter a URL');
    expect(res.statusCode).toBe(0);
    expect(result.current.loading).toBe(false);
  });

  it('handles successful response', async () => {
    const sendAxiosRequestMock = vi.fn().mockResolvedValue({
      statusCode: 200,
      rawResponse: 'hello',
      data: 'hello',
      headers: { 'x-custom': 'value' },
      responseSize: 5,
    });

    vi.spyOn(axiosHook, 'useAxiosRequest').mockReturnValue({
      sendAxiosRequest: sendAxiosRequestMock,
    });

    const { result } = renderHook(() =>
      useSendRequest({
        user: mockUser,
        buildShareRoute: mockBuildShareRoute,
        replaceVariablesInString: mockReplaceVariablesInString,
        navigate: mockNavigate,
      })
    );

    const res = await result.current.sendRequest({
      selectedMethod: 'GET',
      url: '/test',
      requestBody: '',
      headers: [],
    });

    expect(res.error).toBeNull();
    expect(res.data).toBe('hello');
    expect(res.statusCode).toBe(200);
  });

  it('handles axios error', async () => {
    const sendAxiosRequestMock = vi.fn().mockRejectedValue({
      statusCode: 404,
      message: 'Not Found',
      headers: { 'x-test': 'x, y' },
    });

    vi.spyOn(axiosHook, 'useAxiosRequest').mockReturnValue({
      sendAxiosRequest: sendAxiosRequestMock,
    });

    const { result } = renderHook(() =>
      useSendRequest({
        user: mockUser,
        buildShareRoute: mockBuildShareRoute,
        replaceVariablesInString: mockReplaceVariablesInString,
        navigate: mockNavigate,
      })
    );

    const res = await result.current.sendRequest({
      selectedMethod: 'GET',
      url: '/fail',
      requestBody: '',
      headers: [],
    });

    expect(res.error).toBe('Not Found');
    expect(res.statusCode).toBe(404);
  });
});
