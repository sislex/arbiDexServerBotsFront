import { useMemo, useRef, type RefObject, type UIEvent } from 'react';
import { Copy } from 'lucide-react';
import { cn } from './ui/utils';
import { formatConfigForDiff } from '../services/config-diff-format';
import { copyTextToClipboard } from '../services/clipboard';
import { showToast } from '../services/toast';
import { highlightLinesInText, padLineKinds, padLineKindsToCount, type ConfigLineKind } from '../services/config-line-diff';

interface ConfigServerCompareEditorProps {
  originalConfig: string;
  currentConfig: string;
  onCurrentConfigChange: (value: string) => void;
  leftTitle: string;
  rightTitle: string;
  parseErrorLabel: string;
  copyTitle: string;
  copySuccess: string;
  copyError: string;
}

const scrollPanelClassName =
  'h-full min-h-[calc(100vh-260px)] overflow-auto rounded border border-border bg-muted';

const lineKindClassName: Record<ConfigLineKind, string> = {
  same: '',
  removed: 'bg-destructive/15 text-destructive',
  added: 'bg-success/15 text-success',
};

const LINE_HEIGHT_PX = 18;
const PANEL_PADDING_Y_PX = 16;
const GUTTER_CLASS_NAME =
  'sticky left-0 shrink-0 border-r border-border bg-muted/95 px-2 py-4 text-right text-xs leading-[18px] text-muted-foreground select-none';

function PanelHeader({
  title,
  onCopy,
  copyTitle,
}: {
  title: string;
  onCopy: () => void;
  copyTitle: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="text-xs font-medium text-muted-foreground">{title}</div>
      <button
        type="button"
        onClick={onCopy}
        title={copyTitle}
        aria-label={copyTitle}
        className="inline-flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
      >
        <Copy size={14} />
      </button>
    </div>
  );
}

function LineNumberGutter({ lineCount }: { lineCount: number }) {
  return (
    <div className={GUTTER_CLASS_NAME}>
      {Array.from({ length: lineCount }, (_, index) => (
        <div key={index + 1} style={{ height: LINE_HEIGHT_PX }}>
          {index + 1}
        </div>
      ))}
    </div>
  );
}

function HighlightedReadonlyPanel({
  lines,
  lineKinds,
  lineCount,
  scrollRef,
  onScroll,
}: {
  lines: string[];
  lineKinds: ConfigLineKind[];
  lineCount: number;
  scrollRef: RefObject<HTMLDivElement | null>;
  onScroll: (event: UIEvent<HTMLDivElement>) => void;
}) {
  return (
    <div ref={scrollRef} onScroll={onScroll} className={cn(scrollPanelClassName, 'flex')}>
      <LineNumberGutter lineCount={lineCount} />
      <div className="min-w-0 flex-1 py-4 pr-4 text-sm font-mono leading-[18px]">
        {Array.from({ length: lineCount }, (_, index) => {
          const line = lines[index] ?? '';
          return (
            <div
              key={index}
              className={cn('whitespace-pre px-1 rounded-sm', lineKindClassName[lineKinds[index] ?? 'same'])}
              style={{ minHeight: LINE_HEIGHT_PX }}
            >
              {line.length > 0 ? line : '\u00A0'}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HighlightedEditablePanel({
  text,
  lineKinds,
  lineCount,
  scrollRef,
  onScroll,
  onChange,
  onBlur,
}: {
  text: string;
  lineKinds: ConfigLineKind[];
  lineCount: number;
  scrollRef: RefObject<HTMLDivElement | null>;
  onScroll: (event: UIEvent<HTMLDivElement>) => void;
  onChange: (value: string) => void;
  onBlur: () => void;
}) {
  const contentHeight = lineCount * LINE_HEIGHT_PX;

  return (
    <div ref={scrollRef} onScroll={onScroll} className={cn(scrollPanelClassName, 'flex')}>
      <LineNumberGutter lineCount={lineCount} />
      <div className="relative min-w-0 flex-1" style={{ minHeight: contentHeight + PANEL_PADDING_Y_PX * 2 }}>
        <div className="absolute inset-0 pointer-events-none px-4 py-4 font-mono text-sm leading-[18px]">
          {Array.from({ length: lineCount }, (_, index) => (
            <div
              key={index}
              className={cn('rounded-sm', lineKindClassName[lineKinds[index] ?? 'same'])}
              style={{ height: LINE_HEIGHT_PX }}
            />
          ))}
        </div>
        <textarea
          value={text}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          spellCheck={false}
          className="relative z-10 block w-full resize-none overflow-hidden bg-transparent px-4 py-4 text-sm font-mono leading-[18px] text-foreground focus:outline-none"
          style={{ minHeight: contentHeight + PANEL_PADDING_Y_PX * 2, height: contentHeight + PANEL_PADDING_Y_PX * 2 }}
        />
      </div>
    </div>
  );
}

export function ConfigServerCompareEditor({
  originalConfig,
  currentConfig,
  onCurrentConfigChange,
  leftTitle,
  rightTitle,
  parseErrorLabel,
  copyTitle,
  copySuccess,
  copyError,
}: ConfigServerCompareEditorProps) {
  const leftScrollRef = useRef<HTMLDivElement>(null);
  const rightScrollRef = useRef<HTMLDivElement>(null);
  const syncingScrollRef = useRef(false);

  const formattedOriginal = useMemo(() => formatConfigForDiff(originalConfig), [originalConfig]);
  const compareCurrent = useMemo(() => {
    try {
      return formatConfigForDiff(currentConfig);
    } catch {
      return currentConfig;
    }
  }, [currentConfig]);

  const leftLines = useMemo(() => formattedOriginal.split('\n'), [formattedOriginal]);
  const rightLines = useMemo(() => currentConfig.split('\n'), [currentConfig]);
  const lineCount = useMemo(
    () => Math.max(leftLines.length, rightLines.length),
    [leftLines.length, rightLines.length],
  );

  const leftLineKinds = useMemo(() => {
    const kinds = padLineKinds(leftLines, highlightLinesInText(formattedOriginal, compareCurrent, 'left'));
    return padLineKindsToCount(kinds, lineCount);
  }, [compareCurrent, formattedOriginal, leftLines, lineCount]);

  const rightLineKinds = useMemo(() => {
    const kinds = padLineKinds(rightLines, highlightLinesInText(formattedOriginal, compareCurrent, 'right'));
    return padLineKindsToCount(kinds, lineCount);
  }, [compareCurrent, formattedOriginal, rightLines, lineCount]);

  const currentParseError = useMemo(() => {
    try {
      JSON.parse(currentConfig);
      return null;
    } catch (error) {
      return error instanceof Error ? error.message : parseErrorLabel;
    }
  }, [currentConfig, parseErrorLabel]);

  const syncScroll = (source: 'left' | 'right', scrollTop: number) => {
    if (syncingScrollRef.current) {
      return;
    }

    syncingScrollRef.current = true;
    const targetRef = source === 'left' ? rightScrollRef : leftScrollRef;
    if (targetRef.current) {
      targetRef.current.scrollTop = scrollTop;
    }
    syncingScrollRef.current = false;
  };

  const handleCopy = (text: string) => {
    void copyTextToClipboard(text)
      .then(() => {
        showToast('success', copySuccess);
      })
      .catch(() => {
        showToast('error', copyError);
      });
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-3">
      <div className="flex-1 min-h-0 grid grid-cols-2 gap-4">
        <div className="min-h-0 flex flex-col gap-2">
          <PanelHeader
            title={leftTitle}
            copyTitle={copyTitle}
            onCopy={() => handleCopy(formattedOriginal)}
          />
          <HighlightedReadonlyPanel
            lines={leftLines}
            lineKinds={leftLineKinds}
            lineCount={lineCount}
            scrollRef={leftScrollRef}
            onScroll={(event) => syncScroll('left', event.currentTarget.scrollTop)}
          />
        </div>

        <div className="min-h-0 flex flex-col gap-2">
          <PanelHeader
            title={rightTitle}
            copyTitle={copyTitle}
            onCopy={() => handleCopy(currentConfig)}
          />
          <HighlightedEditablePanel
            text={currentConfig}
            lineKinds={rightLineKinds}
            lineCount={lineCount}
            scrollRef={rightScrollRef}
            onScroll={(event) => syncScroll('right', event.currentTarget.scrollTop)}
            onChange={onCurrentConfigChange}
            onBlur={() => {
              try {
                onCurrentConfigChange(formatConfigForDiff(currentConfig));
              } catch {
                // keep raw text while user is fixing invalid JSON
              }
            }}
          />
          {currentParseError && (
            <div className="text-xs text-destructive">
              {parseErrorLabel}: {currentParseError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
