import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Tabs } from './components/Tabs';
import { BotsTab } from './components/BotsTab';
import { RulesTab } from './components/RulesTab';
import { ServerDataTab } from './components/ServerDataTab';
import { BotDetailPage } from './components/BotDetailPage';
import { LanguageProvider } from './i18n/LanguageContext';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { selectActiveTab } from './store/selectors';
import { setActiveTab } from './store/slices/view-slice';
import {
  loadBotControlList,
  loadBotTypes,
  loadJobTypes,
  loadRulesList,
  loadServerData,
} from './store/slices/servers-slice';

export default function App() {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector(selectActiveTab);
  const [selectedBotId, setSelectedBotId] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === 'bots') {
      dispatch(loadBotControlList());
    } else if (activeTab === 'rules') {
      dispatch(loadRulesList());
    } else if (activeTab === 'server-data') {
      dispatch(loadServerData());
      dispatch(loadBotTypes());
      dispatch(loadJobTypes());
    }
  }, [activeTab, dispatch]);

  useEffect(() => {
    dispatch(loadBotControlList());
  }, [dispatch]);

  const handleBotSelect = (botId: string) => {
    setSelectedBotId(botId);
  };

  const handleBackToList = () => {
    setSelectedBotId(null);
  };

  // If a bot is selected, show the detail page
  if (selectedBotId) {
    return (
      <LanguageProvider>
        <BotDetailPage botId={selectedBotId} onBack={handleBackToList} />
      </LanguageProvider>
    );
  }

  // Otherwise, show the main interface
  return (
    <LanguageProvider>
      <div className="size-full flex flex-col bg-gray-50">
        <Header />
          <Tabs activeTab={activeTab} onTabChange={(tab) => dispatch(setActiveTab(tab))} />

        {activeTab === 'bots' && <BotsTab onBotSelect={handleBotSelect} />}
        {activeTab === 'rules' && <RulesTab />}
        {activeTab === 'server-data' && <ServerDataTab />}
      </div>
    </LanguageProvider>
  );
}