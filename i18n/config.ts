/**
 * i18n Configuration
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Platform } from 'react-native';

import tr from './locales/tr.json';
import en from './locales/en.json';

const resources = {
  tr: { translation: tr },
  en: { translation: en },
};

// Get language code - web için browser'dan, native için expo-localization'dan
const getLanguageCode = (): string => {
  if (Platform.OS === 'web') {
    // Web için browser'dan dil bilgisini al
    const browserLang = typeof navigator !== 'undefined' ? navigator.language : 'tr';
    return browserLang.split('-')[0] || 'tr';
  } else {
    // Native için expo-localization kullan
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const Localization = require('expo-localization');
      return Localization.getLocales()[0]?.languageCode || 'tr';
    } catch {
      return 'tr';
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getLanguageCode(),
    fallbackLng: 'tr',
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: 'v3',
  });

export default i18n;

