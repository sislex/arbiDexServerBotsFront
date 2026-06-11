import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  getAuthSession,
  updateAuthSessionPreferences,
} from '../services/auth-storage';
import {
  applyThemeToDocument,
  resolveInitialTheme,
  setStoredTheme,
  type ThemeMode,
} from '../services/theme';

interface ThemeContextType {
  theme: ThemeMode;
  isDark: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  userLogin?: string | null;
}

export function ThemeProvider({ children, userLogin = null }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeMode>(() => resolveInitialTheme(userLogin));

  useEffect(() => {
    const storedTheme = resolveInitialTheme(userLogin);
    setThemeState(storedTheme);
    applyThemeToDocument(storedTheme);
  }, [userLogin]);

  useEffect(() => {
    applyThemeToDocument(theme);
    if (getAuthSession()) {
      updateAuthSessionPreferences({ theme });
      return;
    }
    setStoredTheme(theme, userLogin);
  }, [theme, userLogin]);

  const setTheme = (nextTheme: ThemeMode) => {
    setThemeState(nextTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark: theme === 'dark',
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
