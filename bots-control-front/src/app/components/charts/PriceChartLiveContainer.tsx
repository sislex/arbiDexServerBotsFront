import { useEffect, useMemo, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { serverApi } from '../../services/server-api';
import {
  buildSeriesFromPipeKeys,
  findPriceKeys,
  PRICE_COLORS,
  type PriceSeriesConfig,
} from '../../services/price-key-utils';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAppSelector } from '../../store/hooks';
import { selectActiveBotInfoState, selectActiveServer } from '../../store/selectors';
import { PriceChart, type PricePoint } from './PriceChart';

const FLUSH_INTERVAL = 500;
const MAX_POINTS = 300;

export function PriceChartLiveContainer() {
  const { t } = useLanguage();
  const activeBotInfoState = useAppSelector(selectActiveBotInfoState);
  const activeServer = useAppSelector(selectActiveServer);
  const [data, setData] = useState<PricePoint[]>([]);
  const [series, setSeries] = useState<PriceSeriesConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const flushRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const keysRef = useRef<string[]>([]);
  const midKeyRef = useRef('');
  const isCexQuotesRef = useRef(false);
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
    };
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const jobParams = (activeBotInfoState.data?.jobParams as Record<string, unknown>) ?? {};
        const source = String(jobParams.source ?? '');
        const token0 = String(jobParams.token0 ?? '');
        const token1 = String(jobParams.token1 ?? '');
        const jobType = String(jobParams.jobType ?? '');
        const isCexQuotes = jobType === 'get_Cex_Quotes';
        isCexQuotesRef.current = isCexQuotes;

        if (!source || !token0 || !token1) {
          setData([]);
          setSeries([]);
          setError(t.botDetail.chartTab.missingJobParams);
          return;
        }

        const allKeys = await serverApi.getPriceKeys(activeServerIpPort);
        const found = findPriceKeys(allKeys, source, token0, token1);
        if (!found) {
          setData([]);
          setSeries([]);
          setError(t.botDetail.chartTab.keysNotFound);
          return;
        }

        const pipeKeys = [found.bidKey, found.askKey];
        const flatKeys = pipeKeys.map((k) => k.replace(/\|/g, ''));
        keysRef.current = flatKeys;

        const symbol = found.bidKey.split('|')[1];
        const midKey = `${source}${symbol}mid`;
        midKeyRef.current = midKey;

        if (isCexQuotes) {
          setSeries([
            {
              key: midKey,
              name: `${source.charAt(0).toUpperCase() + source.slice(1)} ${symbol} Mid`,
              color: PRICE_COLORS[2],
            },
          ]);
        } else {
          setSeries(buildSeriesFromPipeKeys(pipeKeys));
        }

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

          if (isCexQuotes) {
            const bid = lastKnown[flatKeys[0]];
            const ask = lastKnown[flatKeys[1]];
            if (bid !== undefined && ask !== undefined) {
              point[midKey] = (bid + ask) / 2;
            }
          } else {
            flatKeys.forEach((key) => {
              if (lastKnown[key] !== undefined) {
                point[key] = lastKnown[key] as number;
              }
            });
          }

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

        socketRef.current?.disconnect();
        socketRef.current = io(`http://${activeServerIpPort}/prices`, {
          transports: ['websocket', 'polling'],
        });
        socketRef.current.on('connect', () => {
          socketRef.current?.emit('subscribe', { keys: pipeKeys });
        });
        socketRef.current.on('connect_error', (e) => {
          setError(`${t.botDetail.chartTab.socketErrorPrefix}: ${e.message}`);
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
          if (isCexQuotesRef.current) {
            const bid = lastKnownRef.current[keysRef.current[0]];
            const ask = lastKnownRef.current[keysRef.current[1]];
            if (bid !== undefined && ask !== undefined) {
              p[midKeyRef.current] = (bid + ask) / 2;
            } else {
              return;
            }
          } else {
            keysRef.current.forEach((k) => {
              if (lastKnownRef.current[k] !== undefined) {
                p[k] = lastKnownRef.current[k];
              }
            });
          }
          bufferRef.current.push(p);
        });

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
  }, [activeBotInfoState.data, activeServerIpPort, t.botDetail.chartTab.keysNotFound, t.botDetail.chartTab.liveLoadError, t.botDetail.chartTab.missingJobParams, t.botDetail.chartTab.socketErrorPrefix]);

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
    <div className="p-4 h-[calc(100vh-176px)]">
      <PriceChart data={data} series={series} />
    </div>
  );
}
