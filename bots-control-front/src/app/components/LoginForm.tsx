import { useState } from 'react';
import { LogIn } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface LoginFormProps {
  onLogin: (login: string, password: string) => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const { t } = useLanguage();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!login.trim() || !password.trim()) {
      setError(t.auth.invalidCredentials);
      return;
    }

    onLogin(login.trim(), password);
  };

  return (
    <div className="size-full flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-card border border-border rounded p-6">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 bg-primary rounded flex items-center justify-center mb-3">
            <span className="text-primary-foreground font-mono text-xl">CA</span>
          </div>
          <h1 className="text-foreground">{t.auth.title}</h1>
          <p className="text-sm text-muted-foreground">{t.auth.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="login-input" className="block text-sm text-muted-foreground mb-2">
              {t.auth.login}
            </label>
            <input
              id="login-input"
              type="text"
              value={login}
              onChange={(event) => setLogin(event.target.value)}
              placeholder={t.auth.loginPlaceholder}
              className="w-full px-3 py-2 bg-input border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              autoComplete="username"
            />
          </div>

          <div>
            <label htmlFor="password-input" className="block text-sm text-muted-foreground mb-2">
              {t.auth.password}
            </label>
            <input
              id="password-input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={t.auth.passwordPlaceholder}
              className="w-full px-3 py-2 bg-input border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              autoComplete="current-password"
            />
          </div>

          {error ? <div className="text-sm text-destructive text-center">{error}</div> : null}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
          >
            <LogIn className="w-4 h-4" />
            {t.auth.signIn}
          </button>
        </form>
      </div>
    </div>
  );
}
