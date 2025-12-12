import type {ColDef} from 'ag-grid-community';

export const botListStabs_1 = [
  {
    "label": "Binance Parser",
    "type": "Crypto Exchange",
    "description": "High-frequency trading bot parsing BTC/USDT, ETH/USDT pairs with real-time order book data and 99.9% uptime"
  }
];

export const botListStabs_2 = [
  {
    "label": "Coinbase Pro Scraper",
    "type": "Crypto API",
    "description": "REST API parser for major cryptocurrency pairs with WebSocket support for live market data"
  },
  {
    "label": "Forex Factory Bot",
    "type": "Forex Data",
    "description": "Economic calendar parser extracting EUR/USD, GBP/USD impact levels and news events"
  },
  {
    "label": "Kraken Market Maker",
    "type": "Trading Bot",
    "description": "Algorithmic trading bot parsing XRP/USD, LTC/USD with spread analysis and liquidity monitoring"
  },
  {
    "label": "Bybit Derivatives",
    "type": "Futures Parser",
    "description": "Derivatives market data collector for BTC/USDT perpetual swaps with funding rate calculations"
  },
  {
    "label": "Uniswap V3 Scanner",
    "type": "DeFi Analytics",
    "description": "DEX liquidity pool parser tracking ETH/USDC pairs with concentration ranges and volume analysis"
  }
];

export const botListStabs_3 = [
  {
    "label": "Binance Spot Parser",
    "type": "Spot Market",
    "description": "Real-time order book data for major pairs: BTC/USDT, ETH/USDT, BNB/BTC with depth chart analysis"
  },
  {
    "label": "FTX Arbitrage Bot",
    "type": "Arbitrage",
    "description": "Cross-exchange price difference detection between FTX and Binance for BTC, ETH perpetuals"
  },
  {
    "label": "Kraken OHLCV Collector",
    "type": "Historical Data",
    "description": "Minute-level OHLCV data aggregation for technical analysis and backtesting strategies"
  },
  {
    "label": "CoinGecko Scraper",
    "type": "Market Cap",
    "description": "Global cryptocurrency market data including prices, volumes, and market dominance metrics"
  },
  {
    "label": "Deribit Options Parser",
    "type": "Options Data",
    "description": "BTC and ETH options chain data with implied volatility and Greeks calculation"
  },
  {
    "label": "BitMEX Liquidations",
    "type": "Risk Monitoring",
    "description": "Real-time liquidation tracking for XBT/USD perpetual swaps with position size analysis"
  },
  {
    "label": "Huobi Margin Parser",
    "type": "Margin Trading",
    "description": "Isolated and cross-margin data for top trading pairs with interest rate monitoring"
  },
  {
    "label": "OKEx Futures Scanner",
    "type": "Futures Data",
    "description": "Quarterly and perpetual futures data with basis and mark price calculations"
  },
  {
    "label": "PancakeSwap Farm Bot",
    "type": "Yield Farming",
    "description": "BSC DEX liquidity pool APY tracking and impermanent loss calculation for CAKE/BNB pairs"
  },
  {
    "label": "Forex.com Streamer",
    "type": "Forex Pairs",
    "description": "Major forex pairs parser: EUR/USD, GBP/USD, USD/JPY with pip movement tracking"
  },
  {
    "label": "Gate.io Market Maker",
    "type": "Market Making",
    "description": "Automated bid-ask spread maintenance for low-cap altcoins with volatility adjustment"
  },
  {
    "label": "dYdX Order Book",
    "type": "Layer 2 DEX",
    "description": "StarkWare-based perpetual swaps parser with cross-margin and isolated position tracking"
  },
  {
    "label": "Bitfinex Lending Bot",
    "type": "Lending Data",
    "description": "Cryptocurrency lending rate monitoring and automated fund provisioning system"
  },
  {
    "label": "SushiSwap Analytics",
    "type": "AMM Parser",
    "description": "Multi-chain DEX analytics tracking TVL, volume, and LP rewards across Ethereum/Polygon"
  },
  {
    "label": "MetaTrader 5 Bridge",
    "type": "Forex Bridge",
    "description": "Real-time forex price streaming from MT5 platform to custom trading algorithms"
  },
  {
    "label": "KuCoin Small Cap",
    "type": "Altcoin Scanner",
    "description": "Low market cap cryptocurrency discovery and volume spike detection bot"
  },
  {
    "label": "Aave Protocol Monitor",
    "type": "Lending Protocol",
    "description": "DeFi lending rates and collateralization ratio monitoring across multiple blockchains"
  },
  {
    "label": "FTX OTC Parser",
    "type": "OTC Market",
    "description": "Large block trade detection and institutional order flow analysis"
  },
  {
    "label": "Chainlink Oracle",
    "type": "Price Feeds",
    "description": "Decentralized oracle price feed verification and deviation monitoring system"
  },
  {
    "label": "Polygon Bridge Bot",
    "type": "Cross-Chain",
    "description": "Asset bridge monitoring between Ethereum and Polygon for arbitrage opportunities"
  }
];



export const botListColDefs: ColDef[] = [
  {
    field: "#",
    headerName: '#',
    width: 50,
    valueGetter: params => {
      if (!params.node || params.node.rowIndex == null) return '';
      return params.node.rowIndex + 1;
    },
  },
  // {
  //   field: "label",
  //   headerName: 'Name',
  //   flex: 1,
  //   cellStyle: { textAlign: 'left' },
  // },
  {
    field: "type",
    headerName: 'Type',
    flex: 1,
    cellStyle: { textAlign: 'left' },
  },
  {
    field: "description",
    headerName: 'Description',
    flex: 3,
    cellStyle: { textAlign: 'left'},
    autoHeight: true,
    wrapText: true,
  },
];

export const botListDefaultColDef: ColDef = {
  sortable: false,
  cellStyle: { textAlign: 'center', border: '1px solid #e0e0e0' },
  headerClass: 'align-center',
  suppressMovable: true,
};
