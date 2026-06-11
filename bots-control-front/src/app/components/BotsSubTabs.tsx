import type { ReactNode } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export type BotsPanelTab = 'info' | 'set-bot' | 'config-server';

interface BotsSubTabsProps {
  activeTab: BotsPanelTab;
  onTabChange: (tab: BotsPanelTab) => void;
  botsCounts?: { total: number; running: number };
  actions?: ReactNode;
}

export function BotsSubTabs({ activeTab, onTabChange, botsCounts, actions }: BotsSubTabsProps) {
  const { t } = useLanguage();

  const infoLabel = botsCounts
    ? t.botsTab.subTabs.info
        .replace('{total}', String(botsCounts.total))
        .replace('{running}', String(botsCounts.running))
    : t.botsTab.subTabs.info;

  const tabs: { id: BotsPanelTab; label: string }[] = [
    { id: 'info', label: infoLabel },
    { id: 'set-bot', label: t.botsTab.subTabs.setBot },
    { id: 'config-server', label: t.botsTab.subTabs.configServer },
  ];

  return (
    <div className="h-11 shrink-0 border-b border-border bg-background flex items-center justify-between gap-3 px-4">
      <div className="h-full flex gap-6 min-w-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`h-full text-sm relative transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>
      {actions ? <div className="flex items-center gap-2 shrink-0">{actions}</div> : null}
    </div>
  );
}
