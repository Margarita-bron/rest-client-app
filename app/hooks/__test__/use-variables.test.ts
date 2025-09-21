import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as localStorageHook from '~/hooks/use-local-storage';
import * as authHook from '~/redux/auth/hooks';
import type { Variable } from '~/types/variables';
import { useVariables } from '~/hooks/use-variables';

describe('useVariables', () => {
  const mockUser = { uid: 'user1' };
  const initialVars: Variable[] = [
    { id: '1', key: 'foo', value: 'bar', enabled: true },
  ];

  const getValueMock = vi.fn();
  const setValueMock = vi.fn();

  beforeEach(() => {
    vi.restoreAllMocks();
    getValueMock.mockReset();
    setValueMock.mockReset();

    vi.spyOn(localStorageHook, 'useLocalStorage').mockReturnValue({
      getValue: getValueMock,
      setValue: setValueMock,
      removeValue: vi.fn(),
    });

    vi.spyOn(authHook, 'useAuth').mockReturnValue({
      user: {
        uid: 'user1',
        email: 'test@example.com',
        name: 'Test User',
      },
      loading: false,
      error: null,
      firestoreProfile: null,
      isAuthenticated: true,
    });
  });

  it('initializes with localStorage value if present', () => {
    getValueMock.mockReturnValue([
      { id: '2', key: 'x', value: 'y', enabled: true },
    ]);
    const { result } = renderHook(() => useVariables(initialVars));

    expect(result.current.variables).toEqual([
      { id: '2', key: 'x', value: 'y', enabled: true },
    ]);
  });

  it('initializes with initialVariables if localStorage is empty', () => {
    getValueMock.mockReturnValue(null);
    const { result } = renderHook(() => useVariables(initialVars));

    expect(result.current.variables).toEqual(initialVars);
  });

  it('adds a variable', () => {
    getValueMock.mockReturnValue([]);
    const { result } = renderHook(() => useVariables());

    act(() => result.current.addVariable());

    expect(result.current.variables.length).toBe(1);
    expect(result.current.variables[0]).toHaveProperty('id');
    expect(result.current.variables[0].key).toBe('');
    expect(result.current.variables[0].value).toBe('');
    expect(result.current.variables[0].enabled).toBe(true);
    expect(setValueMock).toHaveBeenCalled();
  });

  it('updates a variable', () => {
    getValueMock.mockReturnValue(initialVars);
    const { result } = renderHook(() => useVariables(initialVars));

    act(() => result.current.updateVariable('1', 'value', 'baz'));

    expect(result.current.variables[0].value).toBe('baz');
    expect(setValueMock).toHaveBeenCalled();
  });

  it('removes a variable', () => {
    getValueMock.mockReturnValue(initialVars);
    const { result } = renderHook(() => useVariables(initialVars));

    act(() => result.current.removeVariable('1'));

    expect(result.current.variables.length).toBe(0);
    expect(setValueMock).toHaveBeenCalled();
  });

  it('replaces variables in string', () => {
    getValueMock.mockReturnValue(initialVars);
    const { result } = renderHook(() => useVariables(initialVars));

    const str = 'Value is {{foo}}';
    const replaced = result.current.replaceVariablesInString(str);

    expect(replaced).toBe('Value is bar');
  });

  it('ignores disabled or empty variables in replacement', () => {
    const vars: Variable[] = [
      { id: '1', key: 'foo', value: 'bar', enabled: false },
      { id: '2', key: '', value: 'baz', enabled: true },
    ];
    getValueMock.mockReturnValue(vars);
    const { result } = renderHook(() => useVariables(vars));

    const str = 'Value is {{foo}} and {{}}';
    const replaced = result.current.replaceVariablesInString(str);

    expect(replaced).toBe(str);
  });
});
