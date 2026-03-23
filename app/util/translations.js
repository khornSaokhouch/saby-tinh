import { en } from './lang/en';
import { km } from './lang/km';

export const translations = {
  en,
  km
};

/**
 * Translation helper function
 * @param {string} key - The string to translate
 * @param {string} lang - The current language ('en' or 'km')
 * @returns {string} - The translated string
 */
export const t = (key, lang = 'en') => {
  if (!translations[lang]) return key;
  return translations[lang][key] || key;
};
