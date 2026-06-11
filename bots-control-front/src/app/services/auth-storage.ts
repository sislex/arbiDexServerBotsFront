import type { Language } from '../i18n/translations';

const AUTH_SESSION_KEY = 'bots-control-auth-session';
const LEGACY_AUTH_USER_KEY = 'bots-control-auth-user';
const AUTH_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export type AuthThemeMode = 'light' | 'dark';

export interface AuthPreferences {
  language?: Language;
  theme?: AuthThemeMode;
}

export interface AuthSession extends AuthPreferences {
  login: string;
  password: string;
  expiresAt: number;
}

const isLanguage = (value: unknown): value is Language => value === 'en' || value === 'ru';

const isTheme = (value: unknown): value is AuthThemeMode =>
  value === 'light' || value === 'dark';

const parseAuthSession = (raw: string | null): AuthSession | null => {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<AuthSession>;
    if (
      typeof parsed.login !== 'string' ||
      typeof parsed.password !== 'string' ||
      typeof parsed.expiresAt !== 'number'
    ) {
      return null;
    }

    const session: AuthSession = {
      login: parsed.login,
      password: parsed.password,
      expiresAt: parsed.expiresAt,
    };

    if (isLanguage(parsed.language)) {
      session.language = parsed.language;
    }

    if (isTheme(parsed.theme)) {
      session.theme = parsed.theme;
    }

    return session;
  } catch {
    return null;
  }
};

const writeAuthSession = (session: AuthSession) => {
  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
  sessionStorage.removeItem(LEGACY_AUTH_USER_KEY);
};

export const saveAuthSession = (
  login: string,
  password: string,
  preferences?: AuthPreferences,
) => {
  const session: AuthSession = {
    login,
    password,
    expiresAt: Date.now() + AUTH_TTL_MS,
  };

  if (preferences?.language) {
    session.language = preferences.language;
  }

  if (preferences?.theme) {
    session.theme = preferences.theme;
  }

  try {
    writeAuthSession(session);
  } catch {
    // ignore storage errors
  }
};

export const updateAuthSessionPreferences = (preferences: AuthPreferences) => {
  const session = getAuthSession();
  if (!session) {
    return;
  }

  const nextSession: AuthSession = { ...session };

  if (preferences.language) {
    nextSession.language = preferences.language;
  }

  if (preferences.theme) {
    nextSession.theme = preferences.theme;
  }

  try {
    writeAuthSession(nextSession);
  } catch {
    // ignore storage errors
  }
};

export const getAuthSession = (): AuthSession | null => {
  try {
    const session = parseAuthSession(localStorage.getItem(AUTH_SESSION_KEY));
    if (!session) {
      return null;
    }

    if (session.expiresAt <= Date.now()) {
      clearAuthSession();
      return null;
    }

    return session;
  } catch {
    return null;
  }
};

export const getStoredAuthLogin = (): string | null => getAuthSession()?.login ?? null;

export const getStoredAuthLanguage = (): Language | null => {
  const language = getAuthSession()?.language;
  return isLanguage(language) ? language : null;
};

export const getStoredAuthTheme = (): AuthThemeMode | null => {
  const theme = getAuthSession()?.theme;
  return isTheme(theme) ? theme : null;
};

export const clearAuthSession = () => {
  try {
    localStorage.removeItem(AUTH_SESSION_KEY);
    sessionStorage.removeItem(LEGACY_AUTH_USER_KEY);
  } catch {
    // ignore storage errors
  }
};
