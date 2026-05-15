import { useEffect } from 'react';
import { Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { Header } from './components/Header';
import { Tabs } from './components/Tabs';
import { BotsTab } from './components/BotsTab';
import { RulesTab } from './components/RulesTab';
import { ServerDataTab } from './components/ServerDataTab';
import { BotDetailPage } from './components/BotDetailPage';
import { LanguageProvider } from './i18n/LanguageContext';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { selectActiveServer, selectActiveTab } from './store/selectors';
import { setActiveTab } from './store/slices/view-slice';
import {
  loadBotControlList,
  loadBotTypes,
  loadJobTypes,
  loadRulesList,
  loadServerData,
  setActiveServer,
} from './store/slices/servers-slice';

function MainLayout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const activeTab = useAppSelector(selectActiveTab);
  const activeServer = useAppSelector(selectActiveServer);

  const activeServerIpPort = `${activeServer.ip}:${activeServer.port}`;

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
  }, [activeTab, activeServerIpPort, dispatch]);

  useEffect(() => {
    dispatch(loadBotControlList());
  }, [activeServerIpPort, dispatch]);

  const handleBotSelect = (botId: string) => {
    navigate(`/server/${activeServerIpPort}/${botId}`);
  };

  const handleServerSelect = (ipPort: string) => {
    navigate(`/server/${ipPort}/tab/${activeTab}`);
  };

  return (
    <div className="size-full flex flex-col bg-gray-50">
      <Header />
      <Tabs
        activeTab={activeTab}
        onTabChange={(tab) => {
          dispatch(setActiveTab(tab));
          navigate(`/server/${activeServerIpPort}/tab/${tab}`);
        }}
      />

      {activeTab === 'bots' && (
        <BotsTab onBotSelect={handleBotSelect} onServerSelect={handleServerSelect} />
      )}
      {activeTab === 'rules' && <RulesTab />}
      {activeTab === 'server-data' && <ServerDataTab />}
    </div>
  );
}

function BotPageRoute() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const params = useParams<{ ipPort: string; botId: string }>();
  const botId = params.botId ?? '';
  const ipPort = params.ipPort ?? '';

  useEffect(() => {
    const [ip = '', port = ''] = ipPort.split(':');
    if (ip && port) {
      dispatch(setActiveServer({ ip, port, name: `SERVER_${ip}:${port}` }));
    }
  }, [dispatch, ipPort]);

  return (
    <BotDetailPage
      botId={botId}
      onBack={() => navigate(`/server/${ipPort}/tab/bots`)}
    />
  );
}

function TabRouteSync() {
  const dispatch = useAppDispatch();
  const params = useParams<{ ipPort: string; tabId: string }>();
  const tabId = params.tabId ?? 'bots';
  const ipPort = params.ipPort ?? '';

  useEffect(() => {
    const [ip = '', port = ''] = ipPort.split(':');
    if (ip && port) {
      dispatch(setActiveServer({ ip, port, name: `SERVER_${ip}:${port}` }));
    }
    dispatch(setActiveTab(tabId));
  }, [dispatch, ipPort, tabId]);

  return <MainLayout />;
}

export default function App() {
  return (
    <LanguageProvider>
      <Routes>
        <Route path="/server/:ipPort/tab/:tabId" element={<TabRouteSync />} />
        <Route path="/server/:ipPort/:botId" element={<BotPageRoute />} />
        <Route
          path="*"
          element={<Navigate to="/server/45.135.182.251:1001/tab/bots" replace />}
        />
      </Routes>
    </LanguageProvider>
  );
}