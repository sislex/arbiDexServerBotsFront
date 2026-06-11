import { useMemo, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { parseServerRulesConfigJson } from '../services/bot-control-adapter';
import { formatConfigForDiff } from '../services/config-diff-format';
import { ConfigServerCompareEditor } from './ConfigServerCompareEditor';

interface GetConfigServerFormProps {
  originalConfig: string;
  initialConfig: string;
  hasDbOriginal?: boolean;
  isSaving?: boolean;
  onSave: (config: string) => void;
  onBack: () => void;
}

export function GetConfigServerForm({
  originalConfig,
  initialConfig,
  hasDbOriginal = true,
  isSaving = false,
  onSave,
  onBack,
}: GetConfigServerFormProps) {
  const { t } = useLanguage();
  const [config, setConfig] = useState(() => formatConfigForDiff(initialConfig));
  const [error, setError] = useState<string | null>(null);
  const hasChanges = useMemo(() => config !== formatConfigForDiff(initialConfig), [config, initialConfig]);

  const handleSave = () => {
    setError(null);
    try {
      parseServerRulesConfigJson(config);
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : t.botsTab.getConfigServer.invalidJson,
      );
      return;
    }
    onSave(config);
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
      <div className="shrink-0 px-4 pt-4 pb-2 border-b border-border bg-background">
        <h3 className="text-sm text-foreground">{t.botsTab.getConfigServer.title}</h3>
        <p className="text-xs text-muted-foreground mt-1">{t.botsTab.getConfigServer.compareHint}</p>
        {!hasDbOriginal && (
          <p className="text-xs text-warning mt-1">{t.botsTab.getConfigServer.noDbConfig}</p>
        )}
      </div>

      <div className="flex-1 min-h-0 overflow-auto p-4">
        <ConfigServerCompareEditor
          originalConfig={originalConfig}
          currentConfig={config}
          onCurrentConfigChange={(value) => {
            setConfig(value);
            setError(null);
          }}
          leftTitle={t.botsTab.getConfigServer.originalLabel}
          rightTitle={t.botsTab.getConfigServer.updatedLabel}
          parseErrorLabel={t.botsTab.getConfigServer.invalidJson}
          copyTitle={t.botsTab.getConfigServer.copyConfig}
          copySuccess={t.botsTab.getConfigServer.copySuccess}
          copyError={t.botsTab.getConfigServer.copyError}
        />
        {error && <div className="text-sm text-destructive mt-2">{error}</div>}
      </div>

      <div className="shrink-0 flex items-center justify-end gap-3 px-4 py-3 border-t border-border bg-background">
        <button
          type="button"
          onClick={onBack}
          disabled={isSaving}
          className="px-4 py-2 text-foreground hover:bg-muted rounded transition-colors text-sm disabled:opacity-50"
        >
          {t.botsTab.getConfigServer.cancel}
        </button>
        <button
          type="button"
          onClick={() => {
            setConfig(formatConfigForDiff(initialConfig));
            setError(null);
          }}
          disabled={isSaving || !hasChanges}
          className="px-4 py-2 bg-muted text-foreground hover:bg-accent rounded transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t.botsTab.getConfigServer.reset}
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || !hasChanges}
          className="px-4 py-2 bg-primary text-primary-foreground hover:opacity-90 rounded transition-opacity text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t.botsTab.getConfigServer.saveChanges}
        </button>
      </div>
    </div>
  );
}
