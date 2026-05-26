import { Suspense, lazy, useEffect, useState } from 'react';
import { BotDetailHeader } from './BotDetailHeader';
import { BotSubTabs } from './BotSubTabs';
import { BotControlTab } from './BotControlTab';
import { BotErrorsTab } from './BotErrorsTab';
import { BotJobTab } from './BotJobTab';
const PriceChartContainer = lazy(async () =>
  import('./charts/PriceChartContainer').then((module) => ({ default: module.PriceChartContainer })),
);
const PriceChartLiveContainer = lazy(async () =>
  import('./charts/PriceChartLiveContainer').then((module) => ({ default: module.PriceChartLiveContainer })),
);
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectBotControlActionState } from '../store/selectors';
import {
  clearActiveBotData,
  loadActiveBotAll,
  refreshActiveBotTabData,
} from '../store/slices/servers-slice';
import { showToast } from '../services/toast';
import { useLanguage } from '../i18n/LanguageContext';

interface BotDetailPageProps {
  botId: string;
  onBack: () => void;
}

export function BotDetailPage({ botId, onBack }: BotDetailPageProps) {
  const { t } = useLanguage();
  const dispatch = useAppDispatch();
  const botActionState = useAppSelector(selectBotControlActionState);
  const [activeSubTab, setActiveSubTab] = useState('control');

  useEffect(() => {
    dispatch(loadActiveBotAll(botId));
    return () => {
      dispatch(clearActiveBotData());
    };
  }, [botId, dispatch]);

  const tabLoader = (
    <div className="p-4 text-sm text-muted-foreground">
      Loading...
    </div>
  );

  return (
    <div className="size-full flex flex-col bg-background text-foreground">
      <BotDetailHeader
        botId={botId}
        onBack={onBack}
        onRefresh={async () => {
          const result = await dispatch(
            refreshActiveBotTabData({
              botId,
              activeTab: activeSubTab as 'control' | 'errors' | 'job' | 'chart' | 'live-chart',
            }),
          );
          if (refreshActiveBotTabData.fulfilled.match(result)) {
            showToast('success', t.botDetail.refreshSuccess);
          } else {
            showToast('error', result.error.message ?? t.botDetail.refreshError);
          }
        }}
        isRefreshing={botActionState.isLoading}
      />
      <BotSubTabs
        activeTab={activeSubTab}
        onTabChange={setActiveSubTab}
      />

      {activeSubTab === 'control' && <BotControlTab botId={botId} />}
      {activeSubTab === 'errors' && <BotErrorsTab />}
      {activeSubTab === 'job' && <BotJobTab botId={botId} />}
      {activeSubTab === 'chart' && (
        <Suspense fallback={tabLoader}>
          <PriceChartContainer />
        </Suspense>
      )}
      {activeSubTab === 'live-chart' && (
        <Suspense fallback={tabLoader}>
          <PriceChartLiveContainer />
        </Suspense>
      )}
    </div>
  );
}
