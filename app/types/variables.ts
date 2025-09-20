export interface Variable {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export interface VariableContext {
  variables: Variable[];
  setVariables: (variables: Variable[]) => void;
  addVariable: () => void;
  updateVariable: (id: string, field: keyof Variable, value: string | boolean) => void;
  removeVariable: (id: string) => void;
  replaceVariablesInString: (str: string) => string;
}
