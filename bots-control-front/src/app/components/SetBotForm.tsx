import { useState } from 'react';
import { Copy } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { DEFAULT_BOT_CONFIG_TEMPLATE, parseBotConfigJson } from '../services/bot-control-adapter';
import { copyTextToClipboard } from '../services/clipboard';
import { showToast } from '../services/toast';

interface SetBotFormProps {
  initialConfig?: string;
  title?: string;
  hint?: string;
  isSaving?: boolean;
  onSave: (config: string) => void;
  onBack: () => void;
}

export function SetBotForm({
  initialConfig = DEFAULT_BOT_CONFIG_TEMPLATE,
  title,
  hint,
  isSaving = false,
  onSave,
  onBack,
}: SetBotFormProps) {
  const { t } = useLanguage();
  const [config, setConfig] = useState(initialConfig);
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    setError(null);
    try {
      parseBotConfigJson(config);
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : t.botsTab.setBot.invalidJson,
      );
      return;
    }
    onSave(config);
  };

  const handleCopyConfig = () => {
    void copyTextToClipboard(config)
      .then(() => {
        showToast('success', t.botsTab.setBot.copySuccess);
      })
      .catch(() => {
        showToast('error', t.botsTab.setBot.copyError);
      });
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0 overflow-auto p-4">
        <h3 className="text-sm text-foreground mb-2">{title ?? t.botsTab.setBot.title}</h3>
        <p className="text-xs text-muted-foreground mb-3">{hint ?? t.botsTab.setBot.hint}</p>
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
          {t.botsTab.setBot.back}
        </button>
        <button
          type="button"
          onClick={handleCopyConfig}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground hover:bg-accent rounded transition-colors text-sm disabled:opacity-50"
        >
          <Copy size={16} />
          {t.botsTab.setBot.copyConfig}
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-primary text-primary-foreground hover:opacity-90 rounded transition-opacity text-sm disabled:opacity-50"
        >
          {t.botsTab.setBot.save}
        </button>
      </div>
    </div>
  );
}
