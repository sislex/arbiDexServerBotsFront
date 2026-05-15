import { useLanguage } from '../i18n/LanguageContext';

interface BotSubTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  arbitrageCount?: number;
}

export function BotSubTabs({ activeTab, onTabChange, arbitrageCount = 0 }: BotSubTabsProps) {
  const { t } = useLanguage();

  const tabs = [
    { id: 'control', label: t.botDetail.subTabs.controlAndParams },
    { id: 'arbitrage', label: `${t.botDetail.subTabs.arbitrageId} (${arbitrageCount})` },
    { id: 'errors', label: t.botDetail.subTabs.errors },
    { id: 'job', label: t.botDetail.subTabs.job },
    { id: 'chart', label: t.botDetail.subTabs.chart },
    { id: 'live-chart', label: t.botDetail.subTabs.liveChart }
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-6">
      <div className="flex gap-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`py-3 text-sm relative transition-colors ${
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
