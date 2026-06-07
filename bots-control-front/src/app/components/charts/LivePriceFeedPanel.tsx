import { useEffect, useRef, useState, type ReactNode } from 'react';
import { io, type Socket } from 'socket.io-client';
import { serverApi } from '../../services/server-api';
import { PriceChart, ResizableChartPanel, type PricePoint } from './PriceChart';
import type { PriceSeriesConfig } from '../../services/price-key-utils';

const FLUSH_INTERVAL = 500;
const MAX_POINTS = 300;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_BASE_DELAY_MS = 1000;
const LIVE_CHART_DEFAULT_HEIGHT = 200;

interface LivePriceFeedPanelProps {
  title: string;
  description?: string;
  activeServerIpPort: string;
  pipeKeys: string[];
  series: PriceSeriesConfig[];
  socketNamespace: '/prices' | '/store';
  socketEventName: 'priceChange' | 'dataChange';
  withHistory: boolean;
  loadingLabel: string;
  reconnectingLabel: string;
  reconnectFailedLabel: string;
  liveLoadErrorLabel: string;
  socketErrorPrefixLabel: string;
  noLiveDataLabel: string;
  waitingFirstTickLabel: string;
  receivedAtLabel: string;
  messageTimeLabel: string;
  delayLabel: string;
  noTickYetLabel: string;
}

type PricePayload = { key: string; point: { t: number; v: number } };
type LastTickMeta = { receivedAt: number; messageAt: number };

const formatTickDateTime = (timestamp: number) =>
  new Date(timestamp).toLocaleString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
  });

async function loadHistoricalPoints(activeServerIpPort: string, pipeKeys: string[]) {
  const responses = await Promise.all(
    pipeKeys.map(async (pipeKey) => {
      const result = await serverApi.getPriceByKey(activeServerIpPort, pipeKey);
      return { flatKey: pipeKey.replace(/\|/g, ''), result };
    }),
  );

  const responseMap = Object.fromEntries(
    responses.map((item) => [item.flatKey, item.result]),
  ) as Record<string, { points: { t: number; v: number }[] }>;

  const timeSet = new Set<number>();
  Object.values(responseMap).forEach((res) => {
    res.points.forEach((p) => timeSet.add(p.t));
  });
  const times = Array.from(timeSet).sort((a, b) => a - b);

  const sorted: Record<string, { t: number; v: number }[]> = {};
  Object.entries(responseMap).forEach(([key, res]) => {
    sorted[key] = [...res.points].sort((a, b) => a.t - b.t);
  });

  const lastKnown: Record<string, number | undefined> = {};
  const cursors: Record<string, number> = {};
  Object.keys(responseMap).forEach((key) => {
    cursors[key] = 0;
  });

  return times.map((time) => {
    const point: PricePoint = { time };

    Object.keys(responseMap).forEach((key) => {
      const pts = sorted[key] ?? [];
      while (cursors[key] < pts.length && pts[cursors[key]].t <= time) {
        lastKnown[key] = pts[cursors[key]].v;
        cursors[key] += 1;
      }
    });

    Object.keys(responseMap).forEach((key) => {
      if (lastKnown[key] !== undefined) {
        point[key] = lastKnown[key] as number;
      }
    });

    return point;
  });
}

function ChartPanelFrame({
  title,
  description,
  meta,
  legend,
  reconnecting,
  children,
}: {
  title: string;
  description?: string;
  meta?: ReactNode;
  legend: ReactNode;
  reconnecting: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-card/70 p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {description ? <p className="mt-1 text-xs text-muted-foreground">{description}</p> : null}
        {meta}
      </div>
      {legend}
      {reconnecting}
      {children}
    </section>
  );
}

export function LivePriceFeedPanel({
  title,
  description,
  activeServerIpPort,
  pipeKeys,
  series,
  socketNamespace,
  socketEventName,
  withHistory,
  loadingLabel,
  reconnectingLabel,
  reconnectFailedLabel,
  liveLoadErrorLabel,
  socketErrorPrefixLabel,
  noLiveDataLabel,
  waitingFirstTickLabel,
  receivedAtLabel,
  messageTimeLabel,
  delayLabel,
  noTickYetLabel,
}: LivePriceFeedPanelProps) {
  const [data, setData] = useState<PricePoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hiddenKeys, setHiddenKeys] = useState<string[]>([]);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [lastTickMeta, setLastTickMeta] = useState<LastTickMeta | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const flushRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttemptRef = useRef(0);
  const keysRef = useRef<string[]>([]);
  const lastKnownRef = useRef<Record<string, number>>({});
  const bufferRef = useRef<PricePoint[]>([]);

  useEffect(() => {
    return () => {
      if (flushRef.current) {
        clearInterval(flushRef.current);
      }
      socketRef.current?.disconnect();
      socketRef.current = null;
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const flatKeys = pipeKeys.map((key) => key.replace(/\|/g, ''));
        keysRef.current = flatKeys;

        let initialData: PricePoint[] = [];
        if (withHistory) {
          initialData = await loadHistoricalPoints(activeServerIpPort, pipeKeys);
        }

        setData(initialData);
        bufferRef.current = [];
        setLastTickMeta(null);

        const lastKnown: Record<string, number> = {};
        const lastPoint = initialData[initialData.length - 1];
        if (lastPoint) {
          flatKeys.forEach((key) => {
            if (typeof lastPoint[key] === 'number') {
              lastKnown[key] = lastPoint[key];
            }
          });
        }
        lastKnownRef.current = lastKnown;

        if (reconnectTimerRef.current) {
          clearTimeout(reconnectTimerRef.current);
          reconnectTimerRef.current = null;
        }
        reconnectAttemptRef.current = 0;

        const connectSocket = () => {
          socketRef.current?.disconnect();
          socketRef.current = io(`http://${activeServerIpPort}${socketNamespace}`, {
            transports: ['websocket', 'polling'],
            reconnection: false,
          });

          socketRef.current.on('connect', () => {
            reconnectAttemptRef.current = 0;
            setIsReconnecting(false);
            setError(null);
            socketRef.current?.emit('subscribe', { keys: pipeKeys });
          });

          socketRef.current.on('disconnect', () => {
            if (reconnectAttemptRef.current < MAX_RECONNECT_ATTEMPTS) {
              reconnectAttemptRef.current += 1;
              const delay = RECONNECT_BASE_DELAY_MS * 2 ** (reconnectAttemptRef.current - 1);
              setIsReconnecting(true);
              reconnectTimerRef.current = setTimeout(connectSocket, delay);
            } else {
              setIsReconnecting(false);
              setError(reconnectFailedLabel);
            }
          });

          socketRef.current.on('connect_error', (e) => {
            if (reconnectAttemptRef.current < MAX_RECONNECT_ATTEMPTS) {
              reconnectAttemptRef.current += 1;
              const delay = RECONNECT_BASE_DELAY_MS * 2 ** (reconnectAttemptRef.current - 1);
              setIsReconnecting(true);
              reconnectTimerRef.current = setTimeout(connectSocket, delay);
            } else {
              setIsReconnecting(false);
              setError(`${socketErrorPrefixLabel}: ${e.message}`);
            }
          });

          socketRef.current.on(socketEventName, (payload: PricePayload) => {
            if (typeof payload?.point?.v !== 'number' || typeof payload?.point?.t !== 'number') {
              return;
            }

            const stripped = payload.key.replace(/\|/g, '');
            const key = keysRef.current.includes(payload.key)
              ? payload.key
              : keysRef.current.includes(stripped)
                ? stripped
                : null;

            if (!key) {
              return;
            }

            lastKnownRef.current[key] = payload.point.v;
            setLastTickMeta({
              receivedAt: Date.now(),
              messageAt: payload.point.t,
            });

            const point: PricePoint = { time: payload.point.t };
            keysRef.current.forEach((seriesKey) => {
              if (lastKnownRef.current[seriesKey] !== undefined) {
                point[seriesKey] = lastKnownRef.current[seriesKey];
              }
            });
            bufferRef.current.push(point);
          });
        };

        connectSocket();

        if (flushRef.current) {
          clearInterval(flushRef.current);
        }
        flushRef.current = setInterval(() => {
          if (bufferRef.current.length === 0) {
            return;
          }

          setData((prev) => {
            const combined = [...prev, ...bufferRef.current];
            bufferRef.current = [];
            return combined.length > MAX_POINTS
              ? combined.slice(combined.length - MAX_POINTS)
              : combined;
          });
        }, FLUSH_INTERVAL);
      } catch (e) {
        const message = e instanceof Error ? e.message : liveLoadErrorLabel;
        setError(message);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    void load();

    return () => {
      if (flushRef.current) {
        clearInterval(flushRef.current);
        flushRef.current = null;
      }
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [
    activeServerIpPort,
    liveLoadErrorLabel,
    pipeKeys,
    reconnectFailedLabel,
    socketErrorPrefixLabel,
    socketEventName,
    socketNamespace,
    withHistory,
  ]);

  if (isLoading) {
    return <div className="h-full flex items-center justify-center text-gray-500">{loadingLabel}</div>;
  }

  if (error) {
    return <div className="h-full flex items-center justify-center text-red-600 px-6">{error}</div>;
  }

  if (series.length === 0) {
    return <div className="h-full flex items-center justify-center text-gray-400">{noLiveDataLabel}</div>;
  }

  const delayMs = lastTickMeta ? lastTickMeta.receivedAt - lastTickMeta.messageAt : null;

  return (
    <ChartPanelFrame
      title={title}
      description={description}
      meta={
        lastTickMeta ? (
          <div className="mt-2 flex flex-col gap-1 text-xs text-muted-foreground">
            <div>{receivedAtLabel}: {formatTickDateTime(lastTickMeta.receivedAt)}</div>
            <div>{messageTimeLabel}: {formatTickDateTime(lastTickMeta.messageAt)}</div>
            <div className={delayMs !== null && delayMs < 0 ? 'text-red-600 font-medium' : 'text-emerald-600 font-medium'}>
              {delayLabel}: {delayMs} ms
            </div>
          </div>
        ) : (
          <div className="mt-2 text-xs text-muted-foreground">{noTickYetLabel}</div>
        )
      }
      legend={
        <div className="mb-3 flex flex-wrap gap-2">
          {series.map((item) => {
            const hidden = hiddenKeys.includes(item.key);
            return (
              <button
                key={item.key}
                onClick={() =>
                  setHiddenKeys((prev) =>
                    prev.includes(item.key)
                      ? prev.filter((key) => key !== item.key)
                      : [...prev, item.key],
                  )
                }
                className={`px-2 py-1 text-xs rounded border ${
                  hidden
                    ? 'bg-muted text-muted-foreground border-border'
                    : 'bg-card text-foreground border-border'
                }`}
              >
                {item.name}
              </button>
            );
          })}
        </div>
      }
      reconnecting={
        <>
          {isReconnecting ? (
            <div className="text-xs text-warning mb-2">{reconnectingLabel}</div>
          ) : null}
          {data.length === 0 ? (
            <div className="text-xs text-muted-foreground mb-2">{waitingFirstTickLabel}</div>
          ) : null}
        </>
      }
    >
      <ResizableChartPanel defaultHeight={LIVE_CHART_DEFAULT_HEIGHT} minHeight={LIVE_CHART_DEFAULT_HEIGHT}>
        {(height) => <PriceChart data={data} series={series} hiddenKeys={hiddenKeys} height={height} />}
      </ResizableChartPanel>
    </ChartPanelFrame>
  );
}
