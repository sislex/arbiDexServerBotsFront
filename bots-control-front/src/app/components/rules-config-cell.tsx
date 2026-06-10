import type { ICellRendererParams } from 'ag-grid-community';
import { Copy } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { copyTextToClipboard } from '../services/clipboard';
import { showToast } from '../services/toast';

export interface RuleRowData {
  id: string;
  botParams: Record<string, unknown> | null;
  jobParams: Record<string, unknown> | null;
}

export interface RulesConfigCellParams extends ICellRendererParams<RuleRowData> {
  copyTitle?: string;
}

export function RulesConfigCell(params: RulesConfigCellParams) {
  const { t } = useLanguage();
  const displayText = params.valueFormatted ?? String(params.value ?? '-');
  const copyTitle = params.copyTitle ?? t.rulesTab.copyConfig;

  const handleCopy = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    void copyTextToClipboard(displayText)
      .then(() => {
        showToast('success', t.rulesTab.copySuccess);
      })
      .catch(() => {
        showToast('error', t.rulesTab.copyError);
      });
  };

  return (
    <div className="flex items-start gap-2 py-1 w-full h-full">
      <pre className="flex-1 min-w-0 whitespace-pre-wrap text-xs m-0 select-text cursor-text">
        {displayText}
      </pre>
      <button
        type="button"
        onClick={handleCopy}
        className="shrink-0 p-1.5 rounded bg-muted text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        title={copyTitle}
        aria-label={copyTitle}
      >
        <Copy size={14} />
      </button>
    </div>
  );
}

export function RulesFullConfigCopyCell(params: RulesConfigCellParams) {
  const { t } = useLanguage();
  const copyText = getFullRuleCopyText(params);
  const copyTitle = params.copyTitle ?? t.rulesTab.copyRuleConfig;

  const handleCopy = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    void copyTextToClipboard(copyText)
      .then(() => {
        showToast('success', t.rulesTab.copySuccess);
      })
      .catch(() => {
        showToast('error', t.rulesTab.copyError);
      });
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <button
        type="button"
        onClick={handleCopy}
        className="p-1.5 rounded bg-muted text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        title={copyTitle}
        aria-label={copyTitle}
      >
        <Copy size={14} />
      </button>
    </div>
  );
}

export const getFullRuleCopyText = (params: RulesConfigCellParams) =>
  JSON.stringify(
    {
      id: params.data?.id ?? '',
      botParams: params.data?.botParams ?? {},
      jobParams: params.data?.jobParams ?? {},
    },
    null,
    2,
  );
