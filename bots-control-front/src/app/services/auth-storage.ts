const AUTH_SESSION_KEY = 'bots-control-auth-session';
const LEGACY_AUTH_USER_KEY = 'bots-control-auth-user';
const AUTH_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export interface AuthSession {
  login: string;
  password: string;
  expiresAt: number;
}

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

    return {
      login: parsed.login,
      password: parsed.password,
      expiresAt: parsed.expiresAt,
    };
  } catch {
    return null;
  }
};

export const saveAuthSession = (login: string, password: string) => {
  const session: AuthSession = {
    login,
    password,
    expiresAt: Date.now() + AUTH_TTL_MS,
  };

  try {
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
    sessionStorage.removeItem(LEGACY_AUTH_USER_KEY);
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

export const clearAuthSession = () => {
  try {
    localStorage.removeItem(AUTH_SESSION_KEY);
    sessionStorage.removeItem(LEGACY_AUTH_USER_KEY);
  } catch {
    // ignore storage errors
  }
};
