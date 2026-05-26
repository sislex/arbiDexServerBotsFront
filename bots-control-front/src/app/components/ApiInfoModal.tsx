import { useEffect, useMemo, useState } from 'react';
import type { ColDef, FirstDataRenderedEvent } from 'ag-grid-community';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { AppGrid } from './shared/AppGrid';
import { serverApi } from '../services/server-api';
import { useAppSelector } from '../store/hooks';
import { selectActiveServer } from '../store/selectors';
import { useLanguage } from '../i18n/LanguageContext';

interface ApiInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ApiRow {
  method: string;
  path: string;
  description: string;
}

const parseApiRows = (payload: unknown): ApiRow[] => {
  if (!Array.isArray(payload)) {
    return [];
  }
  return payload.map((item) => {
    const map = (item ?? {}) as Record<string, unknown>;
    return {
      method: String(map.method ?? map.type ?? '-'),
      path: String(map.path ?? map.endpoint ?? map.url ?? '-'),
      description: String(map.description ?? map.desc ?? '-'),
    };
  });
};

export function ApiInfoModal({ open, onOpenChange }: ApiInfoModalProps) {
  const { t } = useLanguage();
  const activeServer = useAppSelector(selectActiveServer);
  const [rows, setRows] = useState<ApiRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeServerIpPort = useMemo(
    () => `${activeServer.ip}:${activeServer.port}`,
    [activeServer.ip, activeServer.port],
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    let cancelled = false;
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const apiList = await serverApi.getApiList(activeServerIpPort);
        if (cancelled) return;
        setRows(parseApiRows(apiList));
      } catch (e) {
        if (cancelled) return;
        setRows([]);
        setError(e instanceof Error ? e.message : t.apiInfo.errorLoad);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [activeServerIpPort, open, t.apiInfo.errorLoad]);

  const colDefs: ColDef<ApiRow>[] = [
    {
      colId: 'index',
      headerName: '#',
      maxWidth: 70,
      valueGetter: (params) => (params.node?.rowIndex ?? 0) + 1,
    },
    { field: 'method', headerName: t.apiInfo.method, minWidth: 120 },
    { field: 'path', headerName: t.apiInfo.path, minWidth: 220, flex: 1 },
    {
      field: 'description',
      headerName: t.apiInfo.description,
      minWidth: 320,
      flex: 2,
      wrapText: true,
      autoHeight: true,
    },
  ];

  const autoSizeIndexAndType = (event: FirstDataRenderedEvent<ApiRow>) => {
    event.api.autoSizeColumns(['index', 'method']);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[80vw] w-[90vw] max-w-[90vw] h-[90vh] p-0 flex flex-col">
        <DialogHeader className="px-4 py-3 border-b border-border">
          <DialogTitle>{t.apiInfo.title}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 min-h-0 p-4">
          {error ? (
            <div className="h-full flex items-center justify-center text-destructive">{error}</div>
          ) : isLoading ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              {t.apiInfo.loading}
            </div>
          ) : (
            <AppGrid<ApiRow>
              rowData={rows}
              columnDefs={colDefs}
              className="h-full"
              onFirstDataRendered={autoSizeIndexAndType}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
