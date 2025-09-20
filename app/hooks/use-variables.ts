import { useState, useCallback } from 'react';
import type { Variable } from '~/types/variables';

export function useVariables(initialVariables: Variable[] = []) {
  const [variables, setVariables] = useState<Variable[]>(initialVariables);

  const addVariable = useCallback(() => {
    const newVariable: Variable = {
      id: Date.now().toString(),
      key: '',
      value: '',
      enabled: true,
    };
    setVariables(prev => [...prev, newVariable]);
  }, []);

  const updateVariable = useCallback((id: string, field: keyof Variable, value: string | boolean) => {
    setVariables(prev =>
      prev.map(variable =>
        variable.id === id ? { ...variable, [field]: value } : variable
      )
    );
  }, []);

  const removeVariable = useCallback((id: string) => {
    setVariables(prev => prev.filter(variable => variable.id !== id));
  }, []);

  const replaceVariablesInString = useCallback((str: string): string => {
    if (!str) return str;
    
    let result = str;
    variables.forEach(variable => {
      if (variable.enabled && variable.key && variable.value) {
        const regex = new RegExp(`\\{\\{${variable.key}\\}\\}`, 'g');
        result = result.replace(regex, variable.value);
      }
    });
    
    return result;
  }, [variables]);

  return {
    variables,
    setVariables,
    addVariable,
    updateVariable,
    removeVariable,
    replaceVariablesInString,
  };
}
