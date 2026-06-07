import { useMemo } from 'react';
import {
  buildPricePipeKeysFromJob,
  buildSeriesFromPipeKeys,
  getPricePairFromJob,
} from '../../services/price-key-utils';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAppSelector } from '../../store/hooks';
import { selectActiveBotInfoState, selectActiveServer } from '../../store/selectors';
import { LivePriceFeedPanel } from './LivePriceFeedPanel';

export function PriceChartLiveContainer() {
  const { t } = useLanguage();
  const activeBotInfoState = useAppSelector(selectActiveBotInfoState);
  const activeServer = useAppSelector(selectActiveServer);

  const activeServerIpPort = useMemo(
    () => `${activeServer.ip}:${activeServer.port}`,
    [activeServer.ip, activeServer.port],
  );

  const chartConfig = useMemo(() => {
    const jobParams = (activeBotInfoState.data?.jobParams as Record<string, unknown>) ?? {};
    const pair = getPricePairFromJob(jobParams);

    if (!pair) {
      return null;
    }

    const { source, token0, token1 } = pair;
    const { bidKey, askKey } = buildPricePipeKeysFromJob(source, token0, token1);
    const pipeKeys = [bidKey, askKey];

    return {
      pipeKeys,
      series: buildSeriesFromPipeKeys(pipeKeys),
    };
  }, [activeBotInfoState.data]);

  if (!chartConfig) {
    return (
      <div className="h-full flex items-center justify-center text-red-600 px-6">
        {t.botDetail.chartTab.missingJobParams}
      </div>
    );
  }

  if (chartConfig.series.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        {t.botDetail.chartTab.noLiveData}
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 overflow-auto p-4">
      <div className="flex flex-col gap-6">
        <LivePriceFeedPanel
          title={t.botDetail.chartTab.serverLiveTitle}
          description={t.botDetail.chartTab.serverLiveDescription}
          activeServerIpPort={activeServerIpPort}
          pipeKeys={chartConfig.pipeKeys}
          series={chartConfig.series}
          socketNamespace="/store"
          socketEventName="dataChange"
          withHistory={false}
          loadingLabel={t.botDetail.chartTab.loading}
          reconnectingLabel={t.botDetail.chartTab.reconnecting}
          reconnectFailedLabel={t.botDetail.chartTab.reconnectFailed}
          liveLoadErrorLabel={t.botDetail.chartTab.liveLoadError}
          socketErrorPrefixLabel={t.botDetail.chartTab.socketErrorPrefix}
          noLiveDataLabel={t.botDetail.chartTab.noLiveData}
          waitingFirstTickLabel={t.botDetail.chartTab.waitingFirstTick}
          receivedAtLabel={t.botDetail.chartTab.receivedAt}
          messageTimeLabel={t.botDetail.chartTab.messageTime}
          delayLabel={t.botDetail.chartTab.delay}
          noTickYetLabel={t.botDetail.chartTab.noTickYet}
        />
        <LivePriceFeedPanel
          title={t.botDetail.chartTab.marketLiveTitle}
          description={t.botDetail.chartTab.marketLiveDescription}
          activeServerIpPort={activeServerIpPort}
          pipeKeys={chartConfig.pipeKeys}
          series={chartConfig.series}
          socketNamespace="/prices"
          socketEventName="priceChange"
          withHistory={false}
          loadingLabel={t.botDetail.chartTab.loading}
          reconnectingLabel={t.botDetail.chartTab.reconnecting}
          reconnectFailedLabel={t.botDetail.chartTab.reconnectFailed}
          liveLoadErrorLabel={t.botDetail.chartTab.liveLoadError}
          socketErrorPrefixLabel={t.botDetail.chartTab.socketErrorPrefix}
          noLiveDataLabel={t.botDetail.chartTab.noLiveData}
          waitingFirstTickLabel={t.botDetail.chartTab.waitingFirstTick}
          receivedAtLabel={t.botDetail.chartTab.receivedAt}
          messageTimeLabel={t.botDetail.chartTab.messageTime}
          delayLabel={t.botDetail.chartTab.delay}
          noTickYetLabel={t.botDetail.chartTab.noTickYet}
        />
      </div>
    </div>
  );
}
