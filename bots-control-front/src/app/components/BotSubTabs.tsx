import { useLanguage } from '../i18n/LanguageContext';

interface BotSubTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BotSubTabs({ activeTab, onTabChange }: BotSubTabsProps) {
  const { t } = useLanguage();

  const tabs = [
    { id: 'control', label: t.botDetail.subTabs.controlAndParams },
    { id: 'errors', label: t.botDetail.subTabs.errors },
    { id: 'job', label: t.botDetail.subTabs.job },
    { id: 'chart', label: t.botDetail.subTabs.chart },
    { id: 'live-chart', label: t.botDetail.subTabs.liveChart }
  ];

  return (
    <div className="h-11 bg-background border-b border-border px-4">
      <div className="h-full flex gap-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`h-full text-sm relative transition-colors ${
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
    </div>
  );
}
