import { useMemo, useState } from 'react';
import { Play, Pause, RotateCw, Pencil, Circle, Copy } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  selectActiveBotInfoState,
  selectActiveBotParamsState,
  selectBotControlActionState,
} from '../store/selectors';
import {
  loadActiveBotAll,
  restartBot,
  updateBotFromConfig,
  setBotPaused,
} from '../store/slices/servers-slice';
import { showToast } from '../services/toast';
import { copyTextToClipboard } from '../services/clipboard';
import {
  buildBotConfigClipboardText,
  buildSetBotConfigText,
  extractBotConfigParts,
  mapBotDetailsToViewModel,
} from '../services/bot-control-adapter';
import { formatLastJobResult } from '../services/format-last-job-result';
import { SetBotForm } from './SetBotForm';

interface BotControlTabProps {
  botId: string;
}

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

  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  const editInitialConfig = useMemo(() => {
    const { botParams, jobParams } = extractBotConfigParts(botInfoState.data);
    return buildSetBotConfigText({ id: botId, botParams, jobParams });
  }, [botId, botInfoState.data]);

  const handleEditClick = () => {
    setIsEditFormOpen(true);
  };

  const handleCopyConfig = () => {
    const configText = buildBotConfigClipboardText(botInfoState.data);
    void copyTextToClipboard(configText)
      .then(() => {
        showToast('success', t.botDetail.controlTab.copyConfigSuccess);
      })
      .catch(() => {
        showToast('error', t.botDetail.controlTab.copyConfigError);
      });
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
    { name: t.botDetail.controlTab.fields.lastJobResult, value: formatLastJobResult(controlVm.lastJobResult) },
    { name: t.botDetail.controlTab.fields.botParams, value: currentBotParamsJson },
    { name: t.botDetail.controlTab.fields.jobParams, value: currentJobParamsJson },
  ];

  if (isEditFormOpen) {
    return (
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden h-[calc(100vh-122px)]">
        <SetBotForm
          key={editInitialConfig}
          initialConfig={editInitialConfig}
          title={t.botDetail.controlTab.editTitle}
          hint={t.botDetail.controlTab.editHint}
          isSaving={botControlActionState.isLoading}
          onBack={() => setIsEditFormOpen(false)}
          onSave={async (config) => {
            const result = await dispatch(updateBotFromConfig({ botId, rawConfig: config }));
            if (updateBotFromConfig.fulfilled.match(result)) {
              showToast('success', t.botDetail.controlTab.settingsSaved);
              await dispatch(loadActiveBotAll(botId));
              setIsEditFormOpen(false);
            } else {
              showToast('error', getActionErrorMessage(result, t.botDetail.controlTab.settingsSaveError));
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 overflow-auto h-[calc(100vh-122px)]">
      <div>
        <h3 className="text-sm text-foreground mb-2">{t.botDetail.controlTab.title}</h3>
        <div className="bg-card border border-border rounded overflow-hidden">
          <div className="flex items-center px-6 py-4 gap-4">
            <div className="text-sm text-muted-foreground min-w-[80px]">ID: {botId}</div>

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

            <div className="flex-1"></div>

            <button
              type="button"
              onClick={handleCopyConfig}
              className="flex items-center gap-2 px-3 py-2 rounded transition-colors bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
              title={t.botDetail.controlTab.copyConfig}
            >
              <Copy size={16} />
              <span className="text-xs">{t.botDetail.controlTab.copyConfig}</span>
            </button>

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
                    param.name === t.botDetail.controlTab.fields.jobParams ||
                    param.name === t.botDetail.controlTab.fields.lastJobResult ? (
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
  );
}
