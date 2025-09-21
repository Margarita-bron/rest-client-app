import { useState, useCallback, useEffect, useMemo } from 'react';
import type { Variable } from '~/types/variables';
import { useLocalStorage } from './use-local-storage';
import { useAuth } from '~/redux/auth/hooks';

const STORAGE_KEY = 'rest-client-variables';

export function useVariables(initialVariables: Variable[] = []) {
  const { user } = useAuth();
  const userId = user?.uid;

  const storageKey = useMemo(() => {
    return userId ? `${STORAGE_KEY}-${userId}` : STORAGE_KEY;
  }, [userId]);

  const { getValue, setValue } = useLocalStorage<Variable[]>(storageKey);

  const [variables, setVariables] = useState<Variable[]>(() => {
    return getValue() ?? initialVariables;
  });

  useEffect(() => {
    setValue(variables);
  }, [variables, setValue]);

  const addVariable = useCallback(() => {
    const newVariable: Variable = {
      id: Date.now().toString(),
      key: '',
      value: '',
      enabled: true,
    };
    setVariables((prev) => [...prev, newVariable]);
  }, []);

  const updateVariable = useCallback(
    (id: string, field: keyof Variable, value: string | boolean) => {
      setVariables((prev) =>
        prev.map((variable) =>
          variable.id === id ? { ...variable, [field]: value } : variable
        )
      );
    },
    []
  );

  const removeVariable = useCallback((id: string) => {
    setVariables((prev) => prev.filter((variable) => variable.id !== id));
  }, []);

  const replaceVariablesInString = useCallback(
    (str: string): string => {
      if (!str) return str;

      let result = str;
      variables.forEach((variable) => {
        if (variable.enabled && variable.key && variable.value) {
          const regex = new RegExp(`\\{\\{${variable.key}\\}\\}`, 'g');
          result = result.replace(regex, variable.value);
        }
      });

      return result;
    },
    [variables]
  );

  return {
    variables,
    setVariables,
    addVariable,
    updateVariable,
    removeVariable,
    replaceVariablesInString,
  };
}
