import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
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
  height?: number;
}

export const DEFAULT_CHART_HEIGHT = 500;
const MIN_CHART_HEIGHT = 300;

export function ResizableChartPanel({
  children,
  defaultHeight = DEFAULT_CHART_HEIGHT,
}: {
  children: (height: number) => ReactNode;
  defaultHeight?: number;
}) {
  const [height, setHeight] = useState(defaultHeight);
  const dragStateRef = useRef<{ startY: number; startHeight: number } | null>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!dragStateRef.current) {
        return;
      }

      const delta = event.clientY - dragStateRef.current.startY;
      setHeight(Math.max(MIN_CHART_HEIGHT, dragStateRef.current.startHeight + delta));
    };

    const handleMouseUp = () => {
      if (!dragStateRef.current) {
        return;
      }

      dragStateRef.current = null;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, []);

  const handleResizeStart = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragStateRef.current = { startY: event.clientY, startHeight: height };
    document.body.style.cursor = 'ns-resize';
    document.body.style.userSelect = 'none';
  };

  return (
    <div className="flex flex-col">
      <div
        className="overflow-hidden border border-border rounded-t bg-[#161a25]"
        style={{ height }}
      >
        {children(height)}
      </div>
      <div
        role="separator"
        aria-orientation="horizontal"
        aria-label="Resize chart"
        onMouseDown={handleResizeStart}
        className="h-3 shrink-0 cursor-ns-resize border border-t-0 border-border rounded-b bg-muted hover:bg-accent flex items-center justify-center touch-none select-none"
      >
        <div className="w-12 h-1 rounded-full bg-border" />
      </div>
    </div>
  );
}

export function PriceChart({
  data,
  series,
  hiddenKeys = [],
  streaming = false,
  height = DEFAULT_CHART_HEIGHT,
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
      height,
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
  }, [chartData, height, hiddenKeys, series]);

  return <AgCharts options={options} />;
}
