import { useState } from 'react';
import { ChevronDown, LogOut, Globe, Moon, Sun } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface HeaderProps {
  userName?: string;
  userRole?: 'Administrator' | 'Manager' | 'Viewer';
}

export function Header({ userName = 'John Doe', userRole = 'Administrator' }: HeaderProps) {
  const { language, setLanguage, t } = useLanguage();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ru' : 'en');
  };

  const getRoleTranslation = (role: string) => {
    const roleKey = role.toLowerCase() as 'administrator' | 'manager' | 'viewer';
    return t.header[roleKey] || role;
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl text-gray-900">{t.header.title}</h1>

        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm">
              {userName.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="text-left">
              <div className="text-sm text-gray-900">{userName}</div>
              <div className="text-xs text-gray-500">{getRoleTranslation(userRole)}</div>
            </div>
            <ChevronDown size={16} className={`text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
              <button
                onClick={toggleLanguage}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700"
              >
                <Globe size={16} />
                <span>{t.header.language}: {language === 'en' ? 'English' : 'Русский'}</span>
              </button>
              <button
                onClick={toggleTheme}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700"
              >
                {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                <span>{t.header.theme}: {theme === 'light' ? t.header.lightTheme : t.header.darkTheme}</span>
              </button>
              <hr className="my-2 border-gray-200" />
              <button
                onClick={() => console.log('Logout')}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-sm text-red-600"
              >
                <LogOut size={16} />
                <span>{t.header.logout}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
