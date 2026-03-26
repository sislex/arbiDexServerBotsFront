import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { PriceChart } from './price-chart';
import {
  priceChartStabs_small,
  priceChartStabs_medium,
  priceChartStabs_large,
  priceChartStabs_streaming,
  priceChartStabs_multiExchange,
  priceChartStabs_multiExchangeStreaming,
  twoLineSeries,
  multiExchangeSeries,
} from '../+stabs/price-chart-stabs';

const meta: Meta<PriceChart> = {
  title: 'Components/PriceChart',
  component: PriceChart,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({ imports: [] }),
    (story) => ({
      ...story(),
      template: `
        <div style="width: 100%; height: 600px; background: #0b0e11; padding: 12px; box-sizing: border-box;">
          ${story().template}
        </div>
      `,
    }),
  ],
  argTypes: {
    streaming: { control: 'boolean', description: 'Enable streaming (progressive) mode' },
  },
};

export default meta;
type Story = StoryObj<PriceChart>;

/** Two lines (bid/ask) — small dataset (~50 points) */
export const StaticSmall: Story = {
  args: {
    data: priceChartStabs_small,
    series: twoLineSeries,
    streaming: false,
  },
};

/** Two lines (bid/ask) — medium dataset (~300 points) */
export const StaticMedium: Story = {
  args: {
    data: priceChartStabs_medium,
    series: twoLineSeries,
    streaming: false,
  },
};

/** Two lines (bid/ask) — large dataset (~1 000 points) */
export const StaticLarge: Story = {
  args: {
    data: priceChartStabs_large,
    series: twoLineSeries,
    streaming: false,
  },
};

/** Two lines — streaming mode (points appear every 500 ms) */
export const StreamingMode: Story = {
  args: {
    data: priceChartStabs_streaming,
    series: twoLineSeries,
    streaming: true,
  },
};

/** Five lines from three exchanges: Binance bid/ask, Bybit bid/ask, MEX sell */
export const MultiExchange: Story = {
  args: {
    data: priceChartStabs_multiExchange,
    series: multiExchangeSeries,
    streaming: false,
  },
};

/** Five lines — streaming mode */
export const MultiExchangeStreaming: Story = {
  args: {
    data: priceChartStabs_multiExchangeStreaming,
    series: multiExchangeSeries,
    streaming: true,
  },
};

/** Multi-exchange with some lines hidden via hiddenKeys */
export const MultiExchangeHidden: Story = {
  args: {
    data: priceChartStabs_multiExchange,
    series: multiExchangeSeries,
    hiddenKeys: ['binanceAsk', 'bybitAsk'],
    streaming: false,
  },
};

