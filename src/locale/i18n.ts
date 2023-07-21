import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import languageDetector from 'i18next-browser-languagedetector';
import en from './en';
import jp from './jp';
import zh from './zh';

const resources = {
  en: { ...en },
  jp: { ...jp },
  zh: { ...zh },
};

i18n.use(initReactI18next).use(languageDetector).init({
  resources,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
}).catch(() => {});

export default i18n;
