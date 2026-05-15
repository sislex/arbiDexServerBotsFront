import { useEffect, useMemo, useRef, useState } from 'react';
import { AgCharts } from 'ag-charts-react';
import type { AgCartesianChartOptions } from 'ag-charts-community';
import { ModuleRegistry, AllCommunityModule } from 'ag-charts-community';
import { AllEnterpriseModule } from 'ag-charts-enterprise';
import type { PriceSeriesConfig } from '../../services/price-key-utils';

ModuleRegistry.registerModules([AllCommunityModule, AllEnterpriseModule]);

export interface PricePoint {
  time: number;
  [key: string]: number;
}

interface PriceChartProps {
  data: PricePoint[];
  series: PriceSeriesConfig[];
  hiddenKeys?: string[];
  streaming?: boolean;
}

export function PriceChart({
  data,
  series,
  hiddenKeys = [],
  streaming = false,
}: PriceChartProps) {
  const [chartData, setChartData] = useState<PricePoint[]>([]);
  const streamIndexRef = useRef(0);

  useEffect(() => {
    if (!streaming) {
      setChartData(data);
      return;
    }

    setChartData([]);
    streamIndexRef.current = 0;
    const id = setInterval(() => {
      setChartData((prev) => {
        if (streamIndexRef.current >= data.length) {
          return prev;
        }
        const next = data[streamIndexRef.current];
        streamIndexRef.current += 1;
        return [...prev, next];
      });
    }, 500);

    return () => clearInterval(id);
  }, [data, streaming]);

  const options = useMemo<AgCartesianChartOptions>(() => {
    const hidden = new Set(hiddenKeys);
    const visibleSeries = series.filter((s) => !hidden.has(s.key));

    return {
      data: chartData,
      background: { fill: '#161a25' },
      height: 500,
      padding: { top: 16, right: 16, bottom: 16, left: 16 },
      series: visibleSeries.map((s) => ({
        type: 'line',
        xKey: 'time',
        yKey: s.key,
        yName: s.name,
        stroke: s.color,
        strokeWidth: 2,
        interpolation: { type: 'step', position: 'end' },
        marker: { enabled: false },
      })),
      axes: [
        {
          type: 'number',
          position: 'bottom',
          label: {
            color: '#848e9c',
            formatter: (params: { value: number }) => {
              const d = new Date(params.value);
              return `${d.getHours().toString().padStart(2, '0')}:${d
                .getMinutes()
                .toString()
                .padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
            },
          },
          line: { stroke: '#2b3139' },
        },
        {
          type: 'number',
          position: 'right',
          label: { color: '#848e9c' },
          line: { stroke: '#2b3139' },
        },
      ],
      legend: {
        position: 'top',
        item: {
          label: {
            color: '#eaecef',
          },
        },
      },
      zoom: {
        enabled: true,
        axes: 'x',
        scrollingStep: 0.3,
      },
      navigator: {
        enabled: true,
        height: 30,
      },
    };
  }, [chartData, hiddenKeys, series]);

  return <AgCharts options={options} />;
}
