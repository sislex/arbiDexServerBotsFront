import type {ColDef} from 'ag-grid-community';


export const actionListStabs_1 = [
  {
    "label": "Market Buy Order",
    "type": "Trading Action",
    "description": "Execute immediate market buy order with slippage protection and volume-based execution"
  }
];

export const actionListStabs_2 = [
  {
    "label": "Limit Sell Order",
    "type": "Trading Action",
    "description": "Place limit sell order at specified price level with time-in-force parameters"
  },
  {
    "label": "Stop Loss Trigger",
    "type": "Risk Management",
    "description": "Automated stop loss execution with trailing stop and breakeven calculation"
  },
  {
    "label": "Take Profit Order",
    "type": "Profit Taking",
    "description": "Partial or full position closing at target profit levels with scaling out options"
  },
  {
    "label": "Position Size Calculator",
    "type": "Risk Calculation",
    "description": "Dynamic position sizing based on account equity and risk percentage per trade"
  },
  {
    "label": "Portfolio Rebalancer",
    "type": "Portfolio Management",
    "description": "Automated portfolio rebalancing to target asset allocations with threshold-based triggers"
  }
];

export const actionListStabs_3 = [
  {
    "label": "Market Order Execution",
    "type": "Trading Action",
    "description": "Immediate order execution at current market price with maximum slippage control"
  },
  {
    "label": "OCO Order Placement",
    "type": "Advanced Order",
    "description": "One-Cancels-Other order combining stop loss and take profit in single operation"
  },
  {
    "label": "Grid Trading Setup",
    "type": "Algorithmic Trading",
    "description": "Automated grid trading system with multiple buy/sell levels and profit targeting"
  },
  {
    "label": "DCA Position Builder",
    "type": "Investment Strategy",
    "description": "Dollar-cost averaging position accumulation with scheduled investment intervals"
  },
  {
    "label": "Arbitrage Execution",
    "type": "Multi-Exchange",
    "description": "Simultaneous buy/sell across different exchanges to capture price differences"
  },
  {
    "label": "Liquidation Monitor",
    "type": "Risk Management",
    "description": "Real-time liquidation price monitoring with emergency position adjustment"
  },
  {
    "label": "Funding Rate Arbitrage",
    "type": "Futures Strategy",
    "description": "Automated funding rate capture between perpetual swaps and spot markets"
  },
  {
    "label": "Market Maker Bot",
    "type": "Liquidity Provision",
    "description": "Automated bid-ask spread maintenance with inventory management and adverse selection protection"
  },
  {
    "label": "Volatility Breakout",
    "type": "Trading Strategy",
    "description": "Breakout detection and execution based on volatility expansion and volume confirmation"
  },
  {
    "label": "Mean Reversion Scanner",
    "type": "Statistical Trading",
    "description": "Statistical mean reversion detection with Bollinger Bands and RSI-based entries"
  },
  {
    "label": "News Sentiment Trader",
    "type": "Event-Based",
    "description": "Automated trading based on real-time news sentiment analysis and impact scoring"
  },
  {
    "label": "Technical Pattern Recognition",
    "type": "Chart Analysis",
    "description": "Automated chart pattern detection (head & shoulders, triangles) with confirmation signals"
  },
  {
    "label": "Correlation Trader",
    "type": "Pairs Trading",
    "description": "Statistical arbitrage based on historical correlation breakdown between asset pairs"
  },
  {
    "label": "Market Depth Analyzer",
    "type": "Order Book Analysis",
    "description": "Real-time order book imbalance detection and large order wall analysis"
  },
  {
    "label": "Flash Loan Arbitrage",
    "type": "DeFi Strategy",
    "description": "Cross-protocol arbitrage using flash loans for zero-capital requirement opportunities"
  },
  {
    "label": "Yield Farming Optimizer",
    "type": "DeFi Management",
    "description": "Automated yield farming position management across multiple protocols and pools"
  },
  {
    "label": "Staking Reward Claimer",
    "type": "Passive Income",
    "description": "Automated staking reward collection and compounding across multiple blockchains"
  },
  {
    "label": "Liquidity Migration",
    "type": "DeFi Management",
    "description": "Automated liquidity migration between different versions of protocols for optimal returns"
  },
  {
    "label": "Option Strategy Executor",
    "type": "Derivatives",
    "description": "Multi-leg options strategy execution (straddles, strangles, spreads) with Greeks management"
  },
  {
    "label": "Futures Rollover",
    "type": "Derivatives Management",
    "description": "Automated futures contract rollover before expiration with basis optimization"
  },
  {
    "label": "Portfolio Hedging",
    "type": "Risk Management",
    "description": "Dynamic portfolio hedging using inverse products, options, or futures positions"
  }
];

export const actionListColDefs: ColDef[] = [
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

export const actionListDefaultColDef: ColDef = {
  sortable: false,
  cellStyle: { textAlign: 'center', border: '1px solid #e0e0e0' },
  headerClass: 'align-center',
  suppressMovable: true,
};
