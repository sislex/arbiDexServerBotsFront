import { useLanguage } from '../i18n/LanguageContext';

interface BotDetailHeaderProps {
  botId: string;
  onBack: () => void;
}

export function BotDetailHeader({ botId, onBack }: BotDetailHeaderProps) {
  const { t } = useLanguage();

  return (
    <header className="h-14 bg-card border-b border-border px-4">
      <div className="h-full flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-primary hover:opacity-80 text-sm transition-opacity"
        >
          ← {t.tabs.bots}
        </button>
        <h1 className="text-foreground absolute left-1/2 -translate-x-1/2">{botId}</h1>
        <div className="w-20"></div>
      </div>
    </header>
  );
}
