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
    <div className="bg-white border-b border-gray-200 px-6">
      <div className="flex gap-8">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`py-4 text-sm relative transition-colors ${
              activeTab === tab.id
                ? 'text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
