import { useState, useCallback, useEffect } from 'react';
import type { Variable } from '~/types/variables';
import { useLocalStorage } from './use-local-storage';

const STORAGE_KEY = 'rest-client-variables';

export function useVariables(initialVariables: Variable[] = []) {
  const { getValue, setValue } = useLocalStorage<Variable[]>(STORAGE_KEY);

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
