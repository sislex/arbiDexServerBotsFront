import { getStoredAuthLogin, getStoredAuthTheme } from './auth-storage';

export type ThemeMode = 'light' | 'dark';

const THEME_STORAGE_PREFIX = 'bots-control-theme';

export const getThemeStorageKey = (userLogin?: string | null) => {
  const user = userLogin?.trim();
  return user ? `${THEME_STORAGE_PREFIX}:${user}` : `${THEME_STORAGE_PREFIX}:default`;
};

export const getAuthUserLogin = () => getStoredAuthLogin();

export const getStoredTheme = (userLogin?: string | null): ThemeMode => {
  try {
    const stored = localStorage.getItem(getThemeStorageKey(userLogin));
    return stored === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
};

export const resolveInitialTheme = (userLogin?: string | null): ThemeMode => {
  const sessionTheme = getStoredAuthTheme();
  if (sessionTheme) {
    return sessionTheme;
  }

  return getStoredTheme(userLogin);
};

export const setStoredTheme = (theme: ThemeMode, userLogin?: string | null) => {
  try {
    localStorage.setItem(getThemeStorageKey(userLogin), theme);
  } catch {
    // ignore storage errors
  }
};

export const applyThemeToDocument = (theme: ThemeMode) => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
    return;
  }
  document.documentElement.classList.remove('dark');
};

export const initThemeFromStorage = () => {
  applyThemeToDocument(resolveInitialTheme(getAuthUserLogin()));
};
