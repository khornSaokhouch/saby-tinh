'use client';

import { useLanguageStore } from '@/stores/useLanguageStore';
import { useEffect } from 'react';

export default function LanguageThemeProvider({ children }) {
  const { language } = useLanguageStore();

  useEffect(() => {
    // Update the lang attribute on the html tag
    document.documentElement.lang = language === 'km' ? 'km' : 'en';
    
    // Toggle a class for font-specific styling if needed
    if (language === 'km') {
      document.body.classList.add('font-khmer');
    } else {
      document.body.classList.remove('font-khmer');
    }
  }, [language]);

  return <>{children}</>;
}
