import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './messages/en.json';
import ru from './messages/ru.json';
import { routing } from '~/lib/routing/routes-path';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ru: { translation: ru },
  },
  lng: routing.defaultLocale,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export { i18n };
