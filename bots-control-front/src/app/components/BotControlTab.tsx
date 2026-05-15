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
import { showToast } from '../services/toast';
import { mapBotDetailsToViewModel } from '../services/bot-control-adapter';

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

const getActionErrorMessage = (result: { error?: { message?: string } }, fallback: string) =>
  result.error?.message ?? fallback;

export function BotControlTab({ botId }: BotControlTabProps) {
  const { t } = useLanguage();
  const dispatch = useAppDispatch();
  const botInfoState = useAppSelector(selectActiveBotInfoState);
  const botParamsState = useAppSelector(selectActiveBotParamsState);
  const botControlActionState = useAppSelector(selectBotControlActionState);

  const controlVm = mapBotDetailsToViewModel(botId, botInfoState.data, botParamsState.data);
  const isRunning = controlVm.status === 'active';
  const isSendData = controlVm.isSendData;

  const currentBotParamsJson = controlVm.botParamsJson;
  const currentJobParamsJson = controlVm.jobParamsJson;

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
    const result = await dispatch(saveBotSettings({ botId, data: merged }));
    if (saveBotSettings.fulfilled.match(result)) {
      showToast('success', t.botDetail.controlTab.settingsSaved);
    } else {
      showToast('error', getActionErrorMessage(result, t.botDetail.controlTab.settingsSaveError));
      return;
    }
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

  const parameters = [
    { name: t.botDetail.controlTab.fields.id, value: botId },
    { name: t.botDetail.controlTab.fields.status, value: controlVm.status },
    { name: t.botDetail.controlTab.fields.running, value: pretty(controlVm.running) },
    { name: t.botDetail.controlTab.fields.createdAt, value: pretty(controlVm.createdAt) },
    { name: t.botDetail.controlTab.fields.jobCount, value: pretty(controlVm.jobCount) },
    { name: t.botDetail.controlTab.fields.errorCount, value: pretty(controlVm.errorCount) },
    { name: t.botDetail.controlTab.fields.lastLatency, value: pretty(controlVm.lastLatency) },
    { name: t.botDetail.controlTab.fields.lastJobTimeStart, value: pretty(controlVm.lastJobTimeStart) },
    { name: t.botDetail.controlTab.fields.lastJobTimeFinish, value: pretty(controlVm.lastJobTimeFinish) },
    { name: t.botDetail.controlTab.fields.sendData, value: pretty(isSendData) },
    { name: t.botDetail.controlTab.fields.lastJobResult, value: pretty(controlVm.lastJobResult) },
    { name: t.botDetail.controlTab.fields.botParams, value: currentBotParamsJson || botParams },
    { name: t.botDetail.controlTab.fields.jobParams, value: currentJobParamsJson || jobParams },
  ];

  return (
    <>
      <div className="p-4 space-y-4 overflow-auto h-[calc(100vh-122px)]">
        {/* Bot Control Panel */}
        <div>
          <h3 className="text-sm text-foreground mb-2">{t.botDetail.controlTab.title}</h3>
          <div className="bg-card border border-border rounded overflow-hidden">
            <div className="flex items-center px-6 py-4 gap-4">
              {/* ID Cell */}
              <div className="text-sm text-muted-foreground min-w-[80px]">ID: {botId}</div>

              {/* Status/Start Button */}
              <button
                onClick={async () => {
                  const result = await dispatch(setBotPaused({ botId, pause: false }));
                  if (setBotPaused.fulfilled.match(result)) {
                    showToast('success', t.botDetail.controlTab.startedSuccess);
                  } else {
                    showToast('error', getActionErrorMessage(result, t.botDetail.controlTab.startedError));
                  }
                }}
                disabled={isRunning}
                className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
                  isRunning
                    ? 'bg-success/20 text-success cursor-default'
                    : 'bg-muted text-foreground hover:bg-success/20 hover:text-success'
                }`}
              >
                <Circle size={8} className={isRunning ? 'fill-success text-success' : 'fill-muted-foreground text-muted-foreground'} />
                <Play size={14} className={isRunning ? 'fill-success' : ''} />
                <span className="text-sm">{t.botDetail.controlTab.status}</span>
              </button>

              {/* Pause Button */}
              <button
                onClick={async () => {
                  const result = await dispatch(setBotPaused({ botId, pause: true }));
                  if (setBotPaused.fulfilled.match(result)) {
                    showToast('success', t.botDetail.controlTab.pausedSuccess);
                  } else {
                    showToast('error', getActionErrorMessage(result, t.botDetail.controlTab.pausedError));
                  }
                }}
                disabled={!isRunning}
                className={`p-2.5 rounded transition-colors ${
                  !isRunning
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'bg-muted hover:bg-accent text-foreground'
                }`}
                title={t.botDetail.controlTab.pause}
              >
                <Pause size={18} />
              </button>

              {/* Spacer */}
              <div className="flex-1"></div>

              {/* Send Data toggle */}
              <button
                onClick={async () => {
                  const result = await dispatch(setBotSendData({ botId, isSendData: !isSendData }));
                  if (setBotSendData.fulfilled.match(result)) {
                    showToast('success', t.botDetail.controlTab.sendDataSuccess);
                  } else {
                    showToast('error', getActionErrorMessage(result, t.botDetail.controlTab.sendDataError));
                  }
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded transition-colors ${
                  isSendData
                    ? 'bg-primary/15 text-primary'
                    : 'bg-muted text-muted-foreground hover:bg-accent'
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
                onClick={async () => {
                  const result = await dispatch(restartBot(botId));
                  if (restartBot.fulfilled.match(result)) {
                    showToast('success', t.botDetail.controlTab.restartedSuccess);
                  } else {
                    showToast('error', getActionErrorMessage(result, t.botDetail.controlTab.restartedError));
                  }
                }}
                className="p-2.5 rounded bg-muted hover:bg-accent text-foreground transition-colors"
                title={t.botDetail.controlTab.restart}
              >
                <RotateCw size={18} />
              </button>

              {/* Edit Button */}
              <button
                onClick={handleEditClick}
                className="p-2.5 rounded bg-primary/15 hover:bg-primary/25 text-primary transition-colors"
                title={t.botDetail.controlTab.edit}
              >
                <Pencil size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div>
          <h3 className="text-sm text-foreground mb-2">{t.botDetail.controlTab.results}</h3>
          <div className="bg-card border border-border rounded overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-xs text-muted-foreground w-1/3">{t.botDetail.controlTab.parameter}</th>
                  <th className="px-4 py-3 text-left text-xs text-muted-foreground">{t.botDetail.controlTab.value}</th>
                </tr>
              </thead>
              <tbody>
                {parameters.map((param) => (
                  <tr key={param.name} className="border-b border-border last:border-b-0">
                    <td className="px-4 py-3 text-sm text-muted-foreground">{param.name}</td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {param.name === t.botDetail.controlTab.fields.botParams ||
                      param.name === t.botDetail.controlTab.fields.jobParams ? (
                        <pre className="bg-muted text-foreground border border-border rounded p-3 text-xs font-mono whitespace-pre overflow-x-auto">
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
          <div className="text-sm text-destructive">{botControlActionState.error}</div>
        )}
        {botControlActionState.isLoading && (
          <div className="text-sm text-muted-foreground">{t.botDetail.controlTab.applyingAction}</div>
        )}
      </div>

      {/* Edit Configuration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={handleCancel}
          />

          {/* Modal Window */}
          <div className="relative bg-card border border-border rounded shadow-xl w-[800px] max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-foreground">{t.botDetail.controlTab.modal.title}</h2>
              <button
                onClick={handleCancel}
                className="p-1 hover:bg-muted rounded transition-colors"
              >
                <X size={20} className="text-muted-foreground" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-hidden p-6">
              <div className="flex gap-6 h-full">
                {/* Bot Params Column */}
                <div className="flex-1 flex flex-col">
                  <label className="text-sm text-foreground mb-2">{t.botDetail.controlTab.modal.botParams}</label>
                  <textarea
                    value={tempBotParams}
                    onChange={(e) => setTempBotParams(e.target.value)}
                    className="flex-1 bg-muted text-foreground border border-border rounded p-4 text-sm font-mono resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                    spellCheck={false}
                  />
                </div>

                {/* Job Params Column */}
                <div className="flex-1 flex flex-col">
                  <label className="text-sm text-foreground mb-2">{t.botDetail.controlTab.modal.jobParams}</label>
                  <textarea
                    value={tempJobParams}
                    onChange={(e) => setTempJobParams(e.target.value)}
                    className="flex-1 bg-muted text-foreground border border-border rounded p-4 text-sm font-mono resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                    spellCheck={false}
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-foreground hover:bg-muted rounded transition-colors"
              >
                {t.botDetail.controlTab.modal.cancel}
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-muted text-foreground hover:bg-accent rounded transition-colors"
              >
                {t.botDetail.controlTab.modal.reset}
              </button>
              <button
                onClick={handleSave}
                disabled={botControlActionState.isLoading}
                className="px-4 py-2 bg-primary text-primary-foreground hover:opacity-90 rounded transition-opacity"
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
