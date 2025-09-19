import type { TOptions } from 'i18next';
import { useTranslation } from 'react-i18next';

/**
Custom hook: useTr as wrapper above useTranslation
 * 1. Namespace convenience:
 *    You can provide a namespace once when creating the hook,
 *    so you don't need to prepend it to each key manually:
 *    const t = useTr('Header');
 *    t('signOut'); // automatically looks for 'Header.signOut'
 * 
 * 2. Optional namespace:
 *    If no namespace is provided, behaves like the standard t(key):
 *    const t = useTr();
 *    t('welcome'); // looks for 'welcome'
 *
 * 3. Supports i18next options:
 *    t('authorName', { name: 'Alice' });
 */

type TranslateFunc = (key: string, options?: TOptions) => string;

export function useTr(namespace?: string): TranslateFunc {
  const { t } = useTranslation();

  return (key: string, options?: TOptions) => {
    if (namespace) {
      return t(`${namespace}.${key}`, options);
    }
    return t(key, options);
  };
}
