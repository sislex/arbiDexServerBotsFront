import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearAuthSession,
  getAuthSession,
  getStoredAuthLanguage,
  getStoredAuthLogin,
  getStoredAuthTheme,
  saveAuthSession,
  updateAuthSessionPreferences,
} from './auth-storage';

const AUTH_SESSION_KEY = 'bots-control-auth-session';

describe('auth-storage', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-09T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('saves and restores auth session within one week', () => {
    saveAuthSession('user', 'secret');

    expect(getStoredAuthLogin()).toBe('user');
    expect(getAuthSession()).toEqual({
      login: 'user',
      password: 'secret',
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    });
  });

  it('saves language and theme with auth session', () => {
    saveAuthSession('user', 'secret', { language: 'ru', theme: 'dark' });

    expect(getStoredAuthLanguage()).toBe('ru');
    expect(getStoredAuthTheme()).toBe('dark');
    expect(getAuthSession()).toMatchObject({
      login: 'user',
      password: 'secret',
      language: 'ru',
      theme: 'dark',
    });
  });

  it('updates language and theme in existing session', () => {
    saveAuthSession('user', 'secret');
    updateAuthSessionPreferences({ language: 'ru', theme: 'dark' });

    expect(getStoredAuthLanguage()).toBe('ru');
    expect(getStoredAuthTheme()).toBe('dark');
  });

  it('clears expired auth session', () => {
    saveAuthSession('user', 'secret');
    vi.setSystemTime(new Date('2026-06-17T12:00:01.000Z'));

    expect(getAuthSession()).toBeNull();
    expect(localStorage.getItem(AUTH_SESSION_KEY)).toBeNull();
  });

  it('clears auth session explicitly', () => {
    saveAuthSession('user', 'secret');
    clearAuthSession();

    expect(getStoredAuthLogin()).toBeNull();
    expect(localStorage.getItem(AUTH_SESSION_KEY)).toBeNull();
  });
});
