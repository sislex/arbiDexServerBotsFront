export type ThemeMode = 'light' | 'dark';

const THEME_STORAGE_PREFIX = 'bots-control-theme';
const AUTH_USER_KEY = 'bots-control-auth-user';

export const getThemeStorageKey = (userLogin?: string | null) => {
  const user = userLogin?.trim();
  return user ? `${THEME_STORAGE_PREFIX}:${user}` : `${THEME_STORAGE_PREFIX}:default`;
};

export const getAuthUserLogin = () => sessionStorage.getItem(AUTH_USER_KEY);

export const getStoredTheme = (userLogin?: string | null): ThemeMode => {
  try {
    const stored = localStorage.getItem(getThemeStorageKey(userLogin));
    return stored === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
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
  applyThemeToDocument(getStoredTheme(getAuthUserLogin()));
};
