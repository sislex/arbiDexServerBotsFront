import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  getAuthSession,
  getStoredAuthLanguage,
  updateAuthSessionPreferences,
} from '../services/auth-storage';
import { translations, Language, TranslationKeys } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationKeys;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
  userLogin?: string | null;
}

const resolveInitialLanguage = (userLogin?: string | null): Language =>
  userLogin ? (getStoredAuthLanguage() ?? 'en') : 'en';

export function LanguageProvider({ children, userLogin = null }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(() => resolveInitialLanguage(userLogin));

  useEffect(() => {
    setLanguageState(resolveInitialLanguage(userLogin));
  }, [userLogin]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (getAuthSession()) {
      updateAuthSessionPreferences({ language: lang });
    }
  };

  const value = {
    language,
    setLanguage,
    t: translations[language],
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
