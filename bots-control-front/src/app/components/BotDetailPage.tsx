import { useEffect, useState } from 'react';
import { BotDetailHeader } from './BotDetailHeader';
import { BotSubTabs } from './BotSubTabs';
import { BotControlTab } from './BotControlTab';
import { BotArbitrageTab } from './BotArbitrageTab';
import { BotErrorsTab } from './BotErrorsTab';
import { BotJobTab } from './BotJobTab';
import { PriceChartContainer } from './charts/PriceChartContainer';
import { PriceChartLiveContainer } from './charts/PriceChartLiveContainer';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectActiveBotArbitrageState } from '../store/selectors';
import { clearActiveBotData, loadActiveBotAll } from '../store/slices/servers-slice';

interface BotDetailPageProps {
  botId: string;
  onBack: () => void;
}

export function BotDetailPage({ botId, onBack }: BotDetailPageProps) {
  const dispatch = useAppDispatch();
  const arbitrageState = useAppSelector(selectActiveBotArbitrageState);
  const [activeSubTab, setActiveSubTab] = useState('control');

  useEffect(() => {
    dispatch(loadActiveBotAll(botId));
    return () => {
      dispatch(clearActiveBotData());
    };
  }, [botId, dispatch]);

  return (
    <div className="size-full flex flex-col bg-background text-foreground">
      <BotDetailHeader botId={botId} onBack={onBack} />
      <BotSubTabs
        activeTab={activeSubTab}
        onTabChange={setActiveSubTab}
        arbitrageCount={arbitrageState.data.length}
      />

      {activeSubTab === 'control' && <BotControlTab botId={botId} />}
      {activeSubTab === 'arbitrage' && <BotArbitrageTab />}
      {activeSubTab === 'errors' && <BotErrorsTab />}
      {activeSubTab === 'job' && <BotJobTab botId={botId} />}
      {activeSubTab === 'chart' && <PriceChartContainer />}
      {activeSubTab === 'live-chart' && <PriceChartLiveContainer />}
    </div>
  );
}
