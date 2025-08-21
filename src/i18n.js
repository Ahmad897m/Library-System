import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from './components/Locales/en.json';
import translationAR from './components/Locales/ar.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: translationEN },
      ar: { translation: translationAR }
    },
    lng: localStorage.getItem('appLanguage') || 'en', // اللغة الافتراضية المحفوظة
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });

export default i18n;
