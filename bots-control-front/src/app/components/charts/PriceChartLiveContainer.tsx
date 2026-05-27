import { useEffect, useMemo, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { serverApi } from '../../services/server-api';
import {
  buildPricePipeKeysFromJob,
  buildSeriesFromPipeKeys,
  getPricePairFromJob,
  type PriceSeriesConfig,
} from '../../services/price-key-utils';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAppSelector } from '../../store/hooks';
import { selectActiveBotInfoState, selectActiveServer } from '../../store/selectors';
import { PriceChart, ResizableChartPanel, type PricePoint } from './PriceChart';

const FLUSH_INTERVAL = 500;
const MAX_POINTS = 300;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_BASE_DELAY_MS = 1000;

export function PriceChartLiveContainer() {
  const { t } = useLanguage();
  const activeBotInfoState = useAppSelector(selectActiveBotInfoState);
  const activeServer = useAppSelector(selectActiveServer);
  const [data, setData] = useState<PricePoint[]>([]);
  const [series, setSeries] = useState<PriceSeriesConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hiddenKeys, setHiddenKeys] = useState<string[]>([]);
  const [isReconnecting, setIsReconnecting] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const flushRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttemptRef = useRef(0);
  const keysRef = useRef<string[]>([]);
  const lastKnownRef = useRef<Record<string, number>>({});
  const bufferRef = useRef<PricePoint[]>([]);

  const activeServerIpPort = useMemo(
    () => `${activeServer.ip}:${activeServer.port}`,
    [activeServer.ip, activeServer.port],
  );

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
        const jobParams = (activeBotInfoState.data?.jobParams as Record<string, unknown>) ?? {};
        const pair = getPricePairFromJob(jobParams);

        if (!pair) {
          setData([]);
          setSeries([]);
          setError(t.botDetail.chartTab.missingJobParams);
          return;
        }

        const { source, token0, token1 } = pair;
        const { bidKey, askKey } = buildPricePipeKeysFromJob(source, token0, token1);
        const pipeKeys = [bidKey, askKey];
        const flatKeys = pipeKeys.map((k) => k.replace(/\|/g, ''));
        keysRef.current = flatKeys;
        setSeries(buildSeriesFromPipeKeys(pipeKeys));

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
        flatKeys.forEach((key) => {
          cursors[key] = 0;
        });

        const merged = times.map((t) => {
          const point: PricePoint = { time: t };
          flatKeys.forEach((key) => {
            const pts = sorted[key] ?? [];
            while (cursors[key] < pts.length && pts[cursors[key]].t <= t) {
              lastKnown[key] = pts[cursors[key]].v;
              cursors[key] += 1;
            }
          });

          flatKeys.forEach((key) => {
            if (lastKnown[key] !== undefined) {
              point[key] = lastKnown[key] as number;
            }
          });

          return point;
        });

        setData(merged);
        const lk: Record<string, number> = {};
        const last = merged[merged.length - 1];
        if (last) {
          flatKeys.forEach((k) => {
            if (typeof last[k] === 'number') {
              lk[k] = last[k];
            }
          });
        }
        lastKnownRef.current = lk;
        bufferRef.current = [];

        if (reconnectTimerRef.current) {
          clearTimeout(reconnectTimerRef.current);
          reconnectTimerRef.current = null;
        }
        reconnectAttemptRef.current = 0;

        const connectSocket = () => {
          socketRef.current?.disconnect();
          socketRef.current = io(`http://${activeServerIpPort}/prices`, {
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
              setError(t.botDetail.chartTab.reconnectFailed);
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
              setError(`${t.botDetail.chartTab.socketErrorPrefix}: ${e.message}`);
            }
          });

          socketRef.current.on('priceChange', (payload: { key: string; point: { t: number; v: number } }) => {
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

            const p: PricePoint = { time: payload.point.t };
            keysRef.current.forEach((k) => {
              if (lastKnownRef.current[k] !== undefined) {
                p[k] = lastKnownRef.current[k];
              }
            });
            bufferRef.current.push(p);
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
        const message = e instanceof Error ? e.message : t.botDetail.chartTab.liveLoadError;
        setError(message);
        setData([]);
        setSeries([]);
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
    activeBotInfoState.data,
    activeServerIpPort,
    t.botDetail.chartTab.liveLoadError,
    t.botDetail.chartTab.missingJobParams,
    t.botDetail.chartTab.socketErrorPrefix,
  ]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">{t.botDetail.chartTab.loading}</div>
    );
  }

  if (error) {
    return <div className="h-full flex items-center justify-center text-red-600 px-6">{error}</div>;
  }

  if (series.length === 0) {
    return <div className="h-full flex items-center justify-center text-gray-400">{t.botDetail.chartTab.noLiveData}</div>;
  }

  return (
    <div className="flex-1 min-h-0 overflow-auto p-4">
      <div className="flex flex-wrap gap-2 mb-3">
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
      {isReconnecting ? (
        <div className="text-xs text-warning mb-2">{t.botDetail.chartTab.reconnecting}</div>
      ) : null}
      <ResizableChartPanel>
        {(height) => (
          <PriceChart data={data} series={series} hiddenKeys={hiddenKeys} height={height} streaming />
        )}
      </ResizableChartPanel>
    </div>
  );
}
