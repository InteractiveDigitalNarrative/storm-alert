import { createContext, useContext, useState } from 'react';
import { readProfile } from '../lib/platform';

const LanguageCtx = createContext(null);

export function LanguageProvider({ children }) {
  // A library profile language pre-selects the game language
  const [language, setLanguage] = useState(() => readProfile().language);

  return (
    <LanguageCtx.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageCtx.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageCtx) ?? { language: 'en', setLanguage: () => {} };
}
