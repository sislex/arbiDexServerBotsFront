import { useLanguage } from '../i18n/LanguageContext';

interface BotDetailHeaderProps {
  botId: string;
  onBack: () => void;
}

export function BotDetailHeader({ botId, onBack }: BotDetailHeaderProps) {
  const { t } = useLanguage();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-blue-600 hover:text-blue-700 text-sm"
        >
          ← {t.tabs.bots}
        </button>
        <h1 className="text-2xl text-gray-900 absolute left-1/2 -translate-x-1/2">{botId}</h1>
        <div className="w-20"></div>
      </div>
    </header>
  );
}
