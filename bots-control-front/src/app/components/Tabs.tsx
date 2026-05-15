import { useLanguage } from '../i18n/LanguageContext';

interface TabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Tabs({ activeTab, onTabChange }: TabsProps) {
  const { t } = useLanguage();

  const tabs = [
    { id: 'bots', label: t.tabs.bots },
    { id: 'rules', label: t.tabs.rules },
    { id: 'server-data', label: t.tabs.serverData },
  ];

  return (
    <div className="h-11 bg-background border-b border-border px-4">
      <div className="h-full flex gap-8">
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
