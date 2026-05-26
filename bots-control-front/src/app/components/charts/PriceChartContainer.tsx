import { useEffect, useMemo, useState } from 'react';
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
import { PriceChart, type PricePoint } from './PriceChart';

export function PriceChartContainer() {
  const { t } = useLanguage();
  const activeBotInfoState = useAppSelector(selectActiveBotInfoState);
  const activeServer = useAppSelector(selectActiveServer);
  const [data, setData] = useState<PricePoint[]>([]);
  const [series, setSeries] = useState<PriceSeriesConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hiddenKeys, setHiddenKeys] = useState<string[]>([]);

  const activeServerIpPort = useMemo(
    () => `${activeServer.ip}:${activeServer.port}`,
    [activeServer.ip, activeServer.port],
  );

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
        if (merged.length === 0) {
          setError(t.botDetail.chartTab.noHistoricalPoints);
        }
      } catch (e) {
        const message = e instanceof Error ? e.message : t.botDetail.chartTab.loadError;
        setError(message);
        setData([]);
        setSeries([]);
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [
    activeBotInfoState.data,
    activeServerIpPort,
    t.botDetail.chartTab.loadError,
    t.botDetail.chartTab.missingJobParams,
    t.botDetail.chartTab.noHistoricalPoints,
  ]);

  if (isLoading) {
    return <div className="h-full flex items-center justify-center text-gray-500">{t.botDetail.chartTab.loading}</div>;
  }

  if (error) {
    return <div className="h-full flex items-center justify-center text-red-600 px-6">{error}</div>;
  }

  if (series.length === 0) {
    return <div className="h-full flex items-center justify-center text-gray-400">{t.botDetail.chartTab.noData}</div>;
  }

  return (
    <div className="p-4 h-[calc(100vh-176px)]">
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
      <PriceChart data={data} series={series} hiddenKeys={hiddenKeys} />
    </div>
  );
}
