import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useLanguageStore = create(
  persist(
    (set) => ({
      language: 'en', // default language
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: 'language-storage', // name of the item in storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
