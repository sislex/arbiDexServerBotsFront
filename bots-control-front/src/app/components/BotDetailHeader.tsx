import { useLanguage } from '../i18n/LanguageContext';
import { RefreshCw } from 'lucide-react';

interface BotDetailHeaderProps {
  botId: string;
  onBack: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function BotDetailHeader({ botId, onBack, onRefresh, isRefreshing = false }: BotDetailHeaderProps) {
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
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors ${
            isRefreshing
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : 'bg-primary text-primary-foreground hover:opacity-90'
          }`}
          title={t.header.refresh}
        >
          <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
          {t.header.refresh}
        </button>
      </div>
    </header>
  );
}
