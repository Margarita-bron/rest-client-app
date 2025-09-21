import codegen from 'postman-code-generators';
import sdk from 'postman-collection';

export type Variant = {
  key: string;
};
export type Language = {
  key: string;
  label: string;
  syntax_mode: string;
  variant: Variant[];
};

export type SDKOption = {
  id: string;
  name: string;
  availableOptions?: string[];
  type: string;
  default?: string;
  description?: string;
};

export async function fetchLanguages(): Promise<Language[]> {
  return codegen.getLanguageList();
}

export async function fetchOptions(
  language: string,
  variant: string
): Promise<SDKOption[]> {
  return codegen.getSDKOptions(language, variant);
}

export async function generateCode(
  requestOptions: sdk.Request | sdk.RequestDefinition,
  language: string,
  variant: string,
  sdkOptions: Record<string, any>
): Promise<string> {
  return new Promise((resolve, reject) => {
    codegen.generate(
      requestOptions,
      { language, variant, ...sdkOptions },
      (err: any, snippet: string) => {
        if (err) reject(err);
        else resolve(snippet);
      }
    );
  });
}
