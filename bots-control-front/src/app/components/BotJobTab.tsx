import { useEffect, useMemo, useState } from 'react';
import { Plus, RotateCw, Trash2, RotateCcw } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectActiveBotInfoState, selectBotControlActionState } from '../store/selectors';
import { restartBot, saveBotSettings } from '../store/slices/servers-slice';
import { showToast } from '../services/toast';

interface BotJobTabProps {
  botId: string;
}

export function BotJobTab({ botId }: BotJobTabProps) {
  const { t } = useLanguage();
  const dispatch = useAppDispatch();
  const botInfoState = useAppSelector(selectActiveBotInfoState);
  const botControlActionState = useAppSelector(selectBotControlActionState);

  const jobParamsFromApi = useMemo(
    () => (botInfoState.data?.jobParams as Record<string, unknown> | undefined) ?? {},
    [botInfoState.data?.jobParams],
  );

  const initialFromApi = useMemo(
    () => JSON.stringify(jobParamsFromApi, null, 2),
    [jobParamsFromApi],
  );

  const [jobConfig, setJobConfig] = useState('{}');

  useEffect(() => {
    if (botInfoState.isLoaded) {
      setJobConfig(initialFromApi);
    }
  }, [botInfoState.isLoaded, initialFromApi]);

  const buildSettingsPayload = (parsedJobParams: Record<string, unknown>) =>
    JSON.stringify(
      {
        ...(botInfoState.data ?? { id: botId }),
        jobParams: parsedJobParams,
      },
      null,
      2,
    );

  const handleReset = () => {
    setJobConfig(initialFromApi);
  };

  const handleSave = async () => {
    let parsedJobParams: Record<string, unknown>;
    try {
      parsedJobParams = JSON.parse(jobConfig || '{}') as Record<string, unknown>;
    } catch {
      showToast('error', t.botDetail.jobTab.savedError);
      return;
    }

    const result = await dispatch(
      saveBotSettings({ botId, data: buildSettingsPayload(parsedJobParams) }),
    );
    if (saveBotSettings.fulfilled.match(result)) {
      showToast('success', t.botDetail.jobTab.savedSuccess);
      return;
    }
    showToast('error', result.error.message ?? t.botDetail.jobTab.savedError);
  };

  const handleRerun = async () => {
    let parsedJobParams: Record<string, unknown>;
    try {
      parsedJobParams = JSON.parse(jobConfig || '{}') as Record<string, unknown>;
    } catch {
      showToast('error', t.botDetail.jobTab.savedError);
      return;
    }

    const saveResult = await dispatch(
      saveBotSettings({ botId, data: buildSettingsPayload(parsedJobParams) }),
    );
    if (!saveBotSettings.fulfilled.match(saveResult)) {
      showToast('error', saveResult.error.message ?? t.botDetail.jobTab.savedError);
      return;
    }
    const restartResult = await dispatch(restartBot(botId));
    if (restartBot.fulfilled.match(restartResult)) {
      showToast('success', t.botDetail.jobTab.rerunSuccess);
    } else {
      showToast('error', restartResult.error.message ?? t.botDetail.jobTab.rerunError);
    }
  };

  const handleDelete = () => {
    if (window.confirm(t.botDetail.jobTab.deleteConfirm)) {
      setJobConfig('{}');
    }
  };

  if (botInfoState.isLoading && !botInfoState.isLoaded) {
    return (
      <div className="p-4 h-[calc(100vh-122px)] flex items-center justify-center text-muted-foreground">
        {t.botDetail.chartTab.loading}
      </div>
    );
  }

  if (botInfoState.error) {
    return (
      <div className="p-4 h-[calc(100vh-122px)] flex items-center justify-center text-destructive px-6">
        {botInfoState.error}
      </div>
    );
  }

  return (
    <div className="p-4 h-[calc(100vh-122px)]">
      <h3 className="text-sm text-foreground mb-2">{t.botDetail.jobTab.title}</h3>

      <div className="flex gap-4 h-[calc(100%-28px)]">
        {/* Code Editor */}
        <div className="flex-1">
          <textarea
            value={jobConfig}
            onChange={(e) => setJobConfig(e.target.value)}
            className="w-full h-full bg-muted text-foreground border border-border rounded p-4 text-sm font-mono resize-none focus:outline-none focus:ring-1 focus:ring-primary"
            spellCheck={false}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col justify-end gap-3">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-success text-success-foreground rounded hover:opacity-90 transition-opacity"
          >
            <Plus size={18} />
            <span>{t.botDetail.jobTab.launch}</span>
          </button>
          <button
            onClick={handleRerun}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
          >
            <RotateCw size={18} />
            <span>{t.botDetail.jobTab.rerun}</span>
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded hover:bg-accent transition-colors"
          >
            <RotateCcw size={18} />
            <span>{t.botDetail.jobTab.return}</span>
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded hover:opacity-90 transition-opacity"
          >
            <Trash2 size={18} />
            <span>{t.botDetail.jobTab.delete}</span>
          </button>
        </div>
      </div>
      {botControlActionState.error && (
        <div className="text-sm text-destructive mt-2">{botControlActionState.error}</div>
      )}
      {botControlActionState.isLoading && (
        <div className="text-sm text-muted-foreground mt-2">{t.botDetail.jobTab.saving}</div>
      )}
    </div>
  );
}
