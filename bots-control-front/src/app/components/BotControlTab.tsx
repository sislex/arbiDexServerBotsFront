import { useState } from 'react';
import { Play, Pause, RotateCw, Pencil, X, Circle, Database } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  selectActiveBotInfoState,
  selectActiveBotParamsState,
  selectBotControlActionState,
} from '../store/selectors';
import {
  restartBot,
  saveBotSettings,
  setBotPaused,
  setBotSendData,
} from '../store/slices/servers-slice';

interface BotControlTabProps {
  botId: string;
}

const defaultBotParams = `{
  "name": "BTC-USD-Trader",
  "strategy": "momentum",
  "exchange": "binance",
  "pair": "BTC/USD",
  "parameters": {
    "timeframe": "1h",
    "indicators": ["RSI", "MACD"],
    "riskLevel": "medium"
  }
}`;

const defaultJobParams = `{
  "jobId": "job-arb-001",
  "type": "arbitrage_scanner",
  "schedule": {
    "interval": "5s",
    "enabled": true
  },
  "web3Config": {
    "provider": "https://mainnet.infura.io/v3/YOUR_PROJECT_ID",
    "chainId": 1,
    "gasLimit": 300000
  }
}`;

const pretty = (value: unknown) =>
  typeof value === 'object' && value !== null ? JSON.stringify(value, null, 2) : String(value ?? '-');

export function BotControlTab({ botId }: BotControlTabProps) {
  const { t } = useLanguage();
  const dispatch = useAppDispatch();
  const botInfoState = useAppSelector(selectActiveBotInfoState);
  const botParamsState = useAppSelector(selectActiveBotParamsState);
  const botControlActionState = useAppSelector(selectBotControlActionState);

  const paused = Boolean(
    (botParamsState.data as Record<string, unknown> | null)?.paused ??
      (botInfoState.data?.botParams as Record<string, unknown> | undefined)?.paused ??
      false,
  );
  const isRunning = !paused;
  const isSendData = Boolean(
    (botParamsState.data as Record<string, unknown> | null)?.isSendData ??
      (botInfoState.data as Record<string, unknown> | null)?.isSendData ??
      false,
  );

  const currentBotParamsJson = JSON.stringify(
    (botInfoState.data?.botParams as Record<string, unknown> | undefined) ?? {},
    null,
    2,
  );
  const currentJobParamsJson = JSON.stringify(
    (botInfoState.data?.jobParams as Record<string, unknown> | undefined) ?? {},
    null,
    2,
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [botParams, setBotParams] = useState(defaultBotParams);
  const [jobParams, setJobParams] = useState(defaultJobParams);
  const [tempBotParams, setTempBotParams] = useState(defaultBotParams);
  const [tempJobParams, setTempJobParams] = useState(defaultJobParams);

  const handleEditClick = () => {
    setTempBotParams(currentBotParamsJson || botParams);
    setTempJobParams(currentJobParamsJson || jobParams);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    const merged = JSON.stringify(
      {
        botParams: JSON.parse(tempBotParams || '{}'),
        jobParams: JSON.parse(tempJobParams || '{}'),
      },
      null,
      2,
    );
    await dispatch(saveBotSettings({ botId, data: merged }));
    setBotParams(tempBotParams);
    setJobParams(tempJobParams);
    setIsModalOpen(false);
  };

  const handleReset = () => {
    setTempBotParams(defaultBotParams);
    setTempJobParams(defaultJobParams);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const botParamsData = (botParamsState.data as Record<string, unknown> | null) ?? {};
  const botInfoData = (botInfoState.data as Record<string, unknown> | null) ?? {};
  const parameters = [
    { name: 'id', value: botId },
    { name: 'status', value: isRunning ? 'active' : 'paused' },
    { name: 'running', value: pretty(botParamsData.running) },
    { name: 'createdAt', value: pretty(botParamsData.createdAt ?? botInfoData.createdAt) },
    { name: 'jobCount', value: pretty(botParamsData.jobCount) },
    { name: 'errorCount', value: pretty(botParamsData.errorCount) },
    { name: 'lastLatency', value: pretty(botParamsData.lastLatency) },
    { name: 'lastJobTimeStart', value: pretty(botParamsData.lastJobTimeStart) },
    { name: 'lastJobTimeFinish', value: pretty(botParamsData.lastJobTimeFinish) },
    { name: 'sendData', value: pretty(isSendData) },
    { name: 'lastJobResult', value: pretty(botParamsData.lastJobResult) },
    { name: 'botName', value: currentBotParamsJson || botParams },
    { name: 'jobParams', value: currentJobParamsJson || jobParams },
  ];

  return (
    <>
      <div className="p-6 space-y-6 overflow-auto h-[calc(100vh-176px)]">
        {/* Bot Control Panel */}
        <div>
          <h3 className="text-lg text-gray-900 mb-4">{t.botDetail.controlTab.title}</h3>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center px-6 py-4 gap-4">
              {/* ID Cell */}
              <div className="text-sm text-gray-600 min-w-[80px]">ID: {botId}</div>

              {/* Status/Start Button */}
              <button
                onClick={() => dispatch(setBotPaused({ botId, pause: false }))}
                disabled={isRunning}
                className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
                  isRunning
                    ? 'bg-green-50 text-green-700 cursor-default'
                    : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-700'
                }`}
              >
                <Circle size={8} className={isRunning ? 'fill-green-500 text-green-500' : 'fill-gray-400 text-gray-400'} />
                <Play size={14} className={isRunning ? 'fill-green-700' : ''} />
                <span className="text-sm">{t.botDetail.controlTab.status}</span>
              </button>

              {/* Pause Button */}
              <button
                onClick={() => dispatch(setBotPaused({ botId, pause: true }))}
                disabled={!isRunning}
                className={`p-2.5 rounded transition-colors ${
                  !isRunning
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
                title={t.botDetail.controlTab.pause}
              >
                <Pause size={18} />
              </button>

              {/* Spacer */}
              <div className="flex-1"></div>

              {/* Send Data toggle */}
              <button
                onClick={() => dispatch(setBotSendData({ botId, isSendData: !isSendData }))}
                className={`flex items-center gap-2 px-3 py-2 rounded transition-colors ${
                  isSendData
                    ? 'bg-blue-50 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={isSendData ? t.botDetail.controlTab.sendDataDisable : t.botDetail.controlTab.sendDataEnable}
              >
                <Database size={16} />
                <span className="text-xs">
                  {isSendData ? t.botDetail.controlTab.sendDataOn : t.botDetail.controlTab.sendDataOff}
                </span>
              </button>

              {/* Restart Button */}
              <button
                onClick={() => dispatch(restartBot(botId))}
                className="p-2.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                title={t.botDetail.controlTab.restart}
              >
                <RotateCw size={18} />
              </button>

              {/* Edit Button */}
              <button
                onClick={handleEditClick}
                className="p-2.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                title={t.botDetail.controlTab.edit}
              >
                <Pencil size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div>
          <h3 className="text-lg text-gray-900 mb-4">{t.botDetail.controlTab.results}</h3>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs text-gray-600 w-1/3">{t.botDetail.controlTab.parameter}</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600">{t.botDetail.controlTab.value}</th>
                </tr>
              </thead>
              <tbody>
                {parameters.map((param) => (
                  <tr key={param.name} className="border-b border-gray-100 last:border-b-0">
                    <td className="px-4 py-3 text-sm text-gray-600">{param.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {param.name === 'botName' || param.name === 'jobParams' ? (
                        <pre className="bg-gray-900 text-gray-100 rounded p-3 text-xs font-mono whitespace-pre overflow-x-auto">
                          {param.value}
                        </pre>
                      ) : (
                        param.value
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {botControlActionState.error && (
          <div className="text-sm text-red-600">{botControlActionState.error}</div>
        )}
        {botControlActionState.isLoading && (
          <div className="text-sm text-gray-500">{t.botDetail.controlTab.applyingAction}</div>
        )}
      </div>

      {/* Edit Configuration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={handleCancel}
          />

          {/* Modal Window */}
          <div className="relative bg-white rounded-lg shadow-xl w-[800px] max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl text-gray-900">{t.botDetail.controlTab.modal.title}</h2>
              <button
                onClick={handleCancel}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-hidden p-6">
              <div className="flex gap-6 h-full">
                {/* Bot Params Column */}
                <div className="flex-1 flex flex-col">
                  <label className="text-sm text-gray-700 mb-2">{t.botDetail.controlTab.modal.botParams}</label>
                  <textarea
                    value={tempBotParams}
                    onChange={(e) => setTempBotParams(e.target.value)}
                    className="flex-1 bg-gray-900 text-gray-100 rounded-lg p-4 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    spellCheck={false}
                  />
                </div>

                {/* Job Params Column */}
                <div className="flex-1 flex flex-col">
                  <label className="text-sm text-gray-700 mb-2">{t.botDetail.controlTab.modal.jobParams}</label>
                  <textarea
                    value={tempJobParams}
                    onChange={(e) => setTempJobParams(e.target.value)}
                    className="flex-1 bg-gray-900 text-gray-100 rounded-lg p-4 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    spellCheck={false}
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors"
              >
                {t.botDetail.controlTab.modal.cancel}
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded transition-colors"
              >
                {t.botDetail.controlTab.modal.reset}
              </button>
              <button
                onClick={handleSave}
                disabled={botControlActionState.isLoading}
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded transition-colors"
              >
                {t.botDetail.controlTab.modal.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
