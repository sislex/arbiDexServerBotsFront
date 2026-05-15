import { ProfileMenu } from './ProfileMenu';
import { useLanguage } from '../i18n/LanguageContext';

interface HeaderProps {
  userName?: string;
  userRole?: 'Administrator' | 'Manager' | 'Viewer';
  onLogout?: () => void;
}

export function Header({
  userName = 'John Doe',
  userRole = 'Administrator',
  onLogout,
}: HeaderProps) {
  const { language, setLanguage, t } = useLanguage();
  const isDark = document.documentElement.classList.contains('dark');

  const toggleTheme = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      return;
    }
    document.documentElement.classList.add('dark');
  };

  return (
    <header className="h-14 bg-card border-b border-border px-4">
      <div className="h-full flex items-center justify-between">
        <h1 className="text-foreground">{t.header.title}</h1>

        <div className="flex items-center gap-3">
          <ProfileMenu
            login={userName}
            role={userRole}
            isDark={isDark}
            language={language}
            onThemeToggle={toggleTheme}
            onLanguageChange={setLanguage}
            onLogout={() => onLogout?.()}
          />
        </div>
      </div>
    </header>
  );
}
