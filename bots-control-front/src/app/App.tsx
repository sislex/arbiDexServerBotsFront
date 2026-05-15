import { Suspense, lazy, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Header } from './components/Header';
import { Tabs } from './components/Tabs';
const BotsTab = lazy(async () => import('./components/BotsTab').then((module) => ({ default: module.BotsTab })));
const RulesTab = lazy(async () => import('./components/RulesTab').then((module) => ({ default: module.RulesTab })));
const ServerDataTab = lazy(async () =>
  import('./components/ServerDataTab').then((module) => ({ default: module.ServerDataTab })),
);
const BotDetailPage = lazy(async () =>
  import('./components/BotDetailPage').then((module) => ({ default: module.BotDetailPage })),
);
const LoginForm = lazy(async () =>
  import('./components/LoginForm').then((module) => ({ default: module.LoginForm })),
);
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { useAppDispatch, useAppSelector } from './store/hooks';
import {
  selectActiveServer,
  selectActiveTab,
  selectBotControlListState,
  selectRulesListState,
  selectServerDataState,
} from './store/selectors';
import { setActiveTab } from './store/slices/view-slice';
import {
  loadServersFromDb,
  loadBotControlList,
  loadBotTypes,
  loadJobTypes,
  loadRulesList,
  loadServerData,
  setActiveServer,
} from './store/slices/servers-slice';
import { showToast } from './services/toast';

const VALID_TABS = new Set(['bots', 'rules', 'server-data']);

const parseIpPort = (ipPort: string) => {
  const [ip = '', port = ''] = ipPort.split(':');
  const isValidPort = Number.isInteger(Number(port)) && Number(port) > 0 && Number(port) <= 65535;
  const isValidIp =
    /^(\d{1,3}\.){3}\d{1,3}$/.test(ip) &&
    ip.split('.').every((segment) => {
      const value = Number(segment);
      return value >= 0 && value <= 255;
    });
  if (!isValidIp || !isValidPort) {
    return null;
  }
  return { ip, port };
};

const PageLoader = () => (
  <div className="flex-1 min-h-0 flex items-center justify-center text-muted-foreground text-sm">
    Loading...
  </div>
);

function MainLayout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const activeTab = useAppSelector(selectActiveTab);
  const activeServer = useAppSelector(selectActiveServer);
  const botControlListState = useAppSelector(selectBotControlListState);
  const rulesListState = useAppSelector(selectRulesListState);
  const serverDataState = useAppSelector(selectServerDataState);

  const activeServerIpPort = `${activeServer.ip}:${activeServer.port}`;
  const isRefreshing =
    activeTab === 'bots'
      ? botControlListState.isLoading
      : activeTab === 'rules'
        ? rulesListState.isLoading
        : serverDataState.isLoading;

  const refreshActiveTabData = () => {
    if (activeTab === 'bots') {
      dispatch(loadBotControlList());
    } else if (activeTab === 'rules') {
      dispatch(loadRulesList());
    } else if (activeTab === 'server-data') {
      dispatch(loadServerData());
      dispatch(loadBotTypes());
      dispatch(loadJobTypes());
    }
  };

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    dispatch(loadServersFromDb());
  }, [dispatch]);

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
    <div className="size-full flex flex-col bg-background text-foreground">
      <Toaster position="bottom-right" richColors />
      <Header onLogout={() => {
        sessionStorage.removeItem('bots-control-auth-user');
        window.location.reload();
      }} />
      <Tabs
        activeTab={activeTab}
        onTabChange={(tab) => {
          dispatch(setActiveTab(tab));
          navigate(`/server/${activeServerIpPort}/tab/${tab}`);
        }}
      />

      {activeTab === 'bots' && (
        <Suspense fallback={<PageLoader />}>
          <BotsTab
            onBotSelect={handleBotSelect}
            onServerSelect={handleServerSelect}
            onRefresh={refreshActiveTabData}
            isRefreshing={isRefreshing}
          />
        </Suspense>
      )}
      {activeTab === 'rules' && (
        <Suspense fallback={<PageLoader />}>
          <RulesTab />
        </Suspense>
      )}
      {activeTab === 'server-data' && (
        <Suspense fallback={<PageLoader />}>
          <ServerDataTab />
        </Suspense>
      )}
    </div>
  );
}

function BotPageRoute() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const params = useParams<{ ipPort: string; botId: string }>();
  const botId = params.botId ?? '';
  const ipPort = params.ipPort ?? '';

  useEffect(() => {
    const parsed = parseIpPort(ipPort);
    if (!parsed) {
      showToast('error', t.routing.invalidServer);
      navigate('/server/45.135.182.251:1001/tab/bots', { replace: true });
      return;
    }
    dispatch(setActiveServer({ ...parsed, name: `SERVER_${parsed.ip}:${parsed.port}` }));
  }, [dispatch, ipPort, navigate, t.routing.invalidServer]);

  useEffect(() => {
    if (!botId.trim()) {
      showToast('error', t.routing.invalidBot);
      navigate(`/server/${ipPort}/tab/bots`, { replace: true });
    }
  }, [botId, ipPort, navigate, t.routing.invalidBot]);

  return (
    <div className="size-full flex flex-col bg-background text-foreground">
      <Toaster position="bottom-right" richColors />
      <Header onLogout={() => {
        sessionStorage.removeItem('bots-control-auth-user');
        window.location.reload();
      }} />
      <Suspense fallback={<PageLoader />}>
        <BotDetailPage
          botId={botId}
          onBack={() => navigate(`/server/${ipPort}/tab/bots`)}
        />
      </Suspense>
    </div>
  );
}

function TabRouteSync() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const params = useParams<{ ipPort: string; tabId: string }>();
  const tabId = params.tabId ?? 'bots';
  const ipPort = params.ipPort ?? '';

  useEffect(() => {
    const parsed = parseIpPort(ipPort);
    if (!parsed) {
      showToast('error', t.routing.invalidServer);
      navigate('/server/45.135.182.251:1001/tab/bots', { replace: true });
      return;
    }

    const normalizedTabId = VALID_TABS.has(tabId) ? tabId : 'bots';
    if (normalizedTabId !== tabId) {
      showToast('error', t.routing.invalidTab);
      navigate(`/server/${ipPort}/tab/${normalizedTabId}`, { replace: true });
      return;
    }

    dispatch(setActiveServer({ ...parsed, name: `SERVER_${parsed.ip}:${parsed.port}` }));
    dispatch(setActiveTab(normalizedTabId));
  }, [dispatch, ipPort, navigate, tabId, t.routing.invalidServer, t.routing.invalidTab]);

  return <MainLayout />;
}

export default function App() {
  const [authUser, setAuthUser] = useState(() => sessionStorage.getItem('bots-control-auth-user'));

  if (!authUser) {
    return (
      <LanguageProvider>
        <Suspense fallback={<PageLoader />}>
          <LoginForm
            onLogin={(login) => {
              sessionStorage.setItem('bots-control-auth-user', login);
              setAuthUser(login);
            }}
          />
        </Suspense>
      </LanguageProvider>
    );
  }

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