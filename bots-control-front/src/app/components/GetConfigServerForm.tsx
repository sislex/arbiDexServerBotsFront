import { useMemo, useState } from 'react';
import { Copy } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { parseServerRulesConfigJson } from '../services/bot-control-adapter';
import { copyTextToClipboard } from '../services/clipboard';
import { showToast } from '../services/toast';

interface GetConfigServerFormProps {
  initialConfig: string;
  isSaving?: boolean;
  onSave: (config: string) => void;
  onBack: () => void;
}

export function GetConfigServerForm({
  initialConfig,
  isSaving = false,
  onSave,
  onBack,
}: GetConfigServerFormProps) {
  const { t } = useLanguage();
  const [config, setConfig] = useState(initialConfig);
  const [error, setError] = useState<string | null>(null);
  const hasChanges = useMemo(() => config !== initialConfig, [config, initialConfig]);

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

  const handleCopyConfig = () => {
    void copyTextToClipboard(config)
      .then(() => {
        showToast('success', t.botsTab.getConfigServer.copySuccess);
      })
      .catch(() => {
        showToast('error', t.botsTab.getConfigServer.copyError);
      });
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0 overflow-auto p-4">
        <h3 className="text-sm text-foreground mb-2">{t.botsTab.getConfigServer.title}</h3>
        <p className="text-xs text-muted-foreground mb-3">{t.botsTab.getConfigServer.hint}</p>
        <textarea
          value={config}
          onChange={(event) => {
            setConfig(event.target.value);
            setError(null);
          }}
          className="w-full min-h-[calc(100vh-280px)] bg-muted text-foreground border border-border rounded p-4 text-sm font-mono resize-y focus:outline-none focus:ring-1 focus:ring-primary"
          spellCheck={false}
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
            setConfig(initialConfig);
            setError(null);
          }}
          disabled={isSaving || !hasChanges}
          className="px-4 py-2 bg-muted text-foreground hover:bg-accent rounded transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t.botsTab.getConfigServer.reset}
        </button>
        <button
          type="button"
          onClick={handleCopyConfig}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground hover:bg-accent rounded transition-colors text-sm disabled:opacity-50"
        >
          <Copy size={16} />
          {t.botsTab.getConfigServer.copyConfig}
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
