export const serverStabs_1 = {
  ip: '192.168.0.10',
  port: '6060',
  version: '1.0.0',
  status: 'active',
  timestampFinish: 1902103200,
  timestampStart: 1759494600,
  botControl: [
    {
      id: 'bot-001',
      name: 'Collector Bot',
      type: 'collector',
      description: 'Collects system data and metrics.',
      gate: 'gate_alpha',
      maxTimeRequest: 2500,
      timeRequest: 1800,
      status: 'active',
      sendData: true,
      isStarted: true,
      botJSON: '{ "botName": "Collector" }',
      actionJSON: '{ "action": "fetchData" }',
      actionTypeSelect: 'fetch',
      botTypeSelect: 'collector'
    },
    {
      id: 'bot-002',
      name: 'Monitor Bot',
      type: 'monitor',
      description: 'Monitors health and performance.',
      gate: 'gate_beta',
      maxTimeRequest: 3000,
      timeRequest: 2200,
      status: 'active',
      sendData: false,
      isStarted: true,
      botJSON: '{ "botName": "Monitor" }',
      actionJSON: '{ "action": "statusCheck" }',
      actionTypeSelect: 'status_check',
      botTypeSelect: 'monitor'
    }
  ]
};

export const serverStabs_2 = [
  {
    ip: '192.168.0.11',
    port: '6061',
    version: '1.0.0',
    status: 'active',
    timestampFinish: 1902103200,
    timestampStart: 1759494600,
    botControl: [
      {
        id: 'bot-001',
        name: 'Collector Bot',
        type: 'collector',
        description: 'Collects system data and metrics.',
        gate: 'gate_alpha',
        maxTimeRequest: 2500,
        timeRequest: 1800,
        status: 'active',
        sendData: true,
        isStarted: true,
        botJSON: '{ "botName": "Collector" }',
        actionJSON: '{ "action": "fetchData" }',
        actionTypeSelect: 'fetch',
        botTypeSelect: 'collector'
      }
    ]
  },
  {
    ip: '192.168.0.12',
    port: '6062',
    version: '1.2.1',
    status: 'active',
    timestampFinish: 190220320,
    timestampStart: 1759594600,
    botControl: [
      {
        id: 'bot-002',
        name: 'Monitor Bot',
        type: 'monitor',
        description: 'Monitors system performance.',
        gate: 'gate_beta',
        maxTimeRequest: 3000,
        timeRequest: 2100,
        status: 'inactive',
        sendData: false,
        isStarted: false,
        botJSON: '{ "botName": "Monitor" }',
        actionJSON: '{ "action": "checkStatus" }',
        actionTypeSelect: 'status_check',
        botTypeSelect: 'monitor'
      }
    ]
  },
  {
    ip: '192.168.0.13',
    port: '6063',
    version: '2.0.0',
    status: 'active',
    timestampFinish: 1902303200,
    timestampStart: 1759694600,
    botControl: [
      {
        id: 'bot-003',
        name: 'Analyzer Bot',
        type: 'analyzer',
        description: 'Analyzes collected metrics for anomalies.',
        gate: 'gate_gamma',
        maxTimeRequest: 2800,
        timeRequest: 2200,
        status: 'active',
        sendData: true,
        isStarted: true,
        botJSON: '{ "botName": "Analyzer" }',
        actionJSON: '{ "action": "analyzeData" }',
        actionTypeSelect: 'analyze',
        botTypeSelect: 'analyzer'
      }
    ]
  },
  {
    ip: '192.168.0.14',
    port: '6064',
    version: '2.1.4',
    status: 'active',
    timestampFinish: 1902403200,
    timestampStart: 1759794600,
    botControl: [
      {
        id: 'bot-004',
        name: 'Backup Bot',
        type: 'backup',
        description: 'Performs scheduled data backups.',
        gate: 'gate_delta',
        maxTimeRequest: 3500,
        timeRequest: 2900,
        status: 'active',
        sendData: false,
        isStarted: true,
        botJSON: '{ "botName": "Backup" }',
        actionJSON: '{ "action": "createBackup" }',
        actionTypeSelect: 'backup',
        botTypeSelect: 'backup'
      }
    ]
  },
  {
    ip: '192.168.0.15',
    port: '6065',
    version: '3.0.0',
    status: 'active',
    timestampFinish: 1902503200,
    timestampStart: 1759894600,
    botControl: [
      {
        id: 'bot-005',
        name: 'Notifier Bot',
        type: 'notifier',
        description: 'Sends alerts and notifications.',
        gate: 'gate_epsilon',
        maxTimeRequest: 2700,
        timeRequest: 2000,
        status: 'maintenance',
        sendData: true,
        isStarted: false,
        botJSON: '{ "botName": "Notifier" }',
        actionJSON: '{ "action": "sendAlert" }',
        actionTypeSelect: 'alert',
        botTypeSelect: 'notifier'
      }
    ]
  },
  {
    ip: '192.168.0.15',
    port: '6065',
    version: '3.0.0',
    status: 'active',
    timestampFinish: 1902503200,
    timestampStart: 1759894600,
    botControl: [
      {
        id: 'bot-005',
        name: 'Notifier Bot',
        type: 'notifier',
        description: 'Sends alerts and notifications.',
        gate: 'gate_epsilon',
        maxTimeRequest: 2700,
        timeRequest: 2000,
        status: 'maintenance',
        sendData: true,
        isStarted: false,
        botJSON: '{ "botName": "Notifier" }',
        actionJSON: '{ "action": "sendAlert" }',
        actionTypeSelect: 'alert',
        botTypeSelect: 'notifier'
      }
    ]
  }
];

export const serverStabs_3 = {
  ip: '192.168.0.10',
  port: '6060',
  version: '',
  status: 'error',
  timestampFinish: 1902103200,
  timestampStart: 0,
  botControl: []
};


// export const serverStabs_1 = [
//   {
//     id: 1,
//     authorizationData: 'AuthToken_XYZ',
//     version: 'v1.0.3',
//     timestamp: Date.now() + 1000 * 60 * 3,
//     bots: [
//       {
//         id: 'bot-1-1',
//         name: 'Trading Bot Alpha',
//         type: 'crypto_trading',
//         description: 'Main trading algorithm for BTC/USD',
//         gate: 'binance',
//         maxTimeRequest: 5000,
//         timeRequest: 1500,
//         status: 'active',
//         sendData: true,
//         isStarted: true
//       },
//       {
//         id: 'bot-1-2',
//         name: 'Data Collector Beta',
//         type: 'market_data',
//         description: 'Collects market depth information',
//         gate: 'kraken',
//         maxTimeRequest: 3000,
//         timeRequest: 800,
//         status: 'active',
//         sendData: true,
//         isStarted: true
//       }
//     ],
//     status: 'active',
//   }
// ];
//
// export const serverStabs_2 = [
//   {
//     id: 1,
//     authorizationData: 'AuthToken_XYZ',
//     version: 'v1.0.3',
//     timestamp: Date.now() + 1000 * 60 * 3,
//     bots: [
//       {
//         id: 'bot-2-1',
//         name: 'Arbitrage Scanner',
//         type: 'arbitrage',
//         description: 'Finds cross-exchange arbitrage opportunities',
//         gate: 'multiple',
//         maxTimeRequest: 10000,
//         timeRequest: 2500,
//         status: 'active',
//         sendData: true,
//         isStarted: true
//       },
//       {
//         id: 'bot-2-2',
//         name: 'Price Monitor',
//         type: 'price_tracking',
//         description: 'Tracks price movements across pairs',
//         gate: 'coinbase',
//         maxTimeRequest: 2000,
//         timeRequest: 500,
//         status: 'active',
//         sendData: true,
//         isStarted: true
//       }
//     ],
//     status: 'active',
//   },
//   {
//     id: 2,
//     authorizationData: 'AuthToken_ABC',
//     version: 'v1.0.2',
//     timestamp: Date.now() - 1000 * 90,
//     bots: [
//       {
//         id: 'bot-2-3',
//         name: 'Forex Parser Pro',
//         type: 'forex_parsing',
//         description: 'Real-time forex data collection',
//         gate: 'oanda',
//         maxTimeRequest: 4000,
//         timeRequest: 1200,
//         status: 'closed',
//         sendData: false,
//         isStarted: false
//       },
//       {
//         id: 'bot-2-4',
//         name: 'Signal Generator',
//         type: 'signal_generation',
//         description: 'Generates trading signals based on technical analysis',
//         gate: 'mt4',
//         maxTimeRequest: 6000,
//         timeRequest: 1800,
//         status: 'closed',
//         sendData: false,
//         isStarted: false
//       },
//       {
//         id: 'bot-2-5',
//         name: 'Risk Manager',
//         type: 'risk_management',
//         description: 'Monitors portfolio risk levels',
//         gate: 'internal',
//         maxTimeRequest: 3000,
//         timeRequest: 900,
//         status: 'closed',
//         sendData: false,
//         isStarted: false
//       },
//       {
//         id: 'bot-2-6',
//         name: 'Backtest Engine',
//         type: 'backtesting',
//         description: 'Runs historical strategy tests',
//         gate: 'local',
//         maxTimeRequest: 15000,
//         timeRequest: 4500,
//         status: 'closed',
//         sendData: false,
//         isStarted: false
//       }
//     ],
//     status: 'closed',
//   },
//   {
//     id: 3,
//     authorizationData: 'AuthToken_DEF',
//     version: 'v1.0.4',
//     timestamp: Date.now() + 1000 * 60 * 10,
//     bots: [
//       {
//         id: 'bot-3-1',
//         name: 'Liquidity Watcher',
//         type: 'liquidity_monitoring',
//         description: 'Monitors market liquidity depth',
//         gate: 'bitfinex',
//         maxTimeRequest: 3500,
//         timeRequest: 1100,
//         status: 'pending',
//         sendData: false,
//         isStarted: false
//       }
//     ],
//     status: 'pending',
//   },
//   {
//     id: 4,
//     authorizationData: 'AuthToken_GHI',
//     version: 'v1.0.1',
//     timestamp: Date.now() - 1000 * 60 * 5,
//     bots: [
//       {
//         id: 'bot-4-1',
//         name: 'Market Maker Pro',
//         type: 'market_making',
//         description: 'Automated market making strategy',
//         gate: 'kraken',
//         maxTimeRequest: 8000,
//         timeRequest: 2200,
//         status: 'error',
//         sendData: false,
//         isStarted: false
//       },
//       {
//         id: 'bot-4-2',
//         name: 'Order Book Analyzer',
//         type: 'order_book_analysis',
//         description: 'Analyzes order book dynamics',
//         gate: 'binance',
//         maxTimeRequest: 5000,
//         timeRequest: 1600,
//         status: 'error',
//         sendData: false,
//         isStarted: false
//       },
//       {
//         id: 'bot-4-3',
//         name: 'Volume Scanner',
//         type: 'volume_analysis',
//         description: 'Scans for unusual volume patterns',
//         gate: 'coinbase',
//         maxTimeRequest: 3000,
//         timeRequest: 950,
//         status: 'error',
//         sendData: false,
//         isStarted: false
//       }
//     ],
//     status: 'error',
//   },
//   {
//     id: 5,
//     authorizationData: 'AuthToken_JKL',
//     version: 'v1.0.5',
//     timestamp: Date.now() + 1000 * 60 * 30,
//     bots: [
//       {
//         id: 'bot-5-1',
//         name: 'Cross Exchange Trader',
//         type: 'cross_exchange',
//         description: 'Executes trades across multiple exchanges',
//         gate: 'multiple',
//         maxTimeRequest: 12000,
//         timeRequest: 3000,
//         status: 'active',
//         sendData: true,
//         isStarted: true
//       },
//       {
//         id: 'bot-5-2',
//         name: 'Derivatives Monitor',
//         type: 'derivatives_tracking',
//         description: 'Tracks futures and options markets',
//         gate: 'deribit',
//         maxTimeRequest: 6000,
//         timeRequest: 1800,
//         status: 'active',
//         sendData: true,
//         isStarted: true
//       },
//       {
//         id: 'bot-5-3',
//         name: 'Yield Optimizer',
//         type: 'yield_farming',
//         description: 'Automates yield farming strategies',
//         gate: 'uniswap',
//         maxTimeRequest: 9000,
//         timeRequest: 2400,
//         status: 'active',
//         sendData: true,
//         isStarted: true
//       },
//       {
//         id: 'bot-5-4',
//         name: 'Lending Assistant',
//         type: 'lending_monitoring',
//         description: 'Monitors lending rates and opportunities',
//         gate: 'aave',
//         maxTimeRequest: 4000,
//         timeRequest: 1300,
//         status: 'active',
//         sendData: true,
//         isStarted: true
//       },
//       {
//         id: 'bot-5-5',
//         name: 'Portfolio Tracker',
//         type: 'portfolio_management',
//         description: 'Tracks portfolio performance across platforms',
//         gate: 'internal',
//         maxTimeRequest: 7000,
//         timeRequest: 2000,
//         status: 'active',
//         sendData: true,
//         isStarted: true
//       }
//     ],
//     status: 'active',
//   },
//   {
//     id: 6,
//     authorizationData: 'AuthToken_MNO',
//     version: 'v1.0.0',
//     timestamp: Date.now() - 1000 * 60 * 60,
//     bots: [],
//     status: 'error',
//   },
//   {
//     id: 7,
//     authorizationData: 'AuthToken_PQR',
//     version: 'v1.0.3',
//     timestamp: Date.now() + 1000 * 60 * 2,
//     bots: [
//       {
//         id: 'bot-7-1',
//         name: 'Technical Analyzer',
//         type: 'technical_analysis',
//         description: 'Performs advanced technical analysis',
//         gate: 'tradingview',
//         maxTimeRequest: 5500,
//         timeRequest: 1700,
//         status: 'pending',
//         sendData: false,
//         isStarted: false
//       },
//       {
//         id: 'bot-7-2',
//         name: 'Sentiment Tracker',
//         type: 'sentiment_analysis',
//         description: 'Analyzes market sentiment from social media',
//         gate: 'twitter',
//         maxTimeRequest: 8000,
//         timeRequest: 2600,
//         status: 'pending',
//         sendData: false,
//         isStarted: false
//       }
//     ],
//     status: 'pending',
//   },
//   {
//     id: 8,
//     authorizationData: 'AuthToken_STU',
//     version: 'v1.0.2',
//     timestamp: Date.now() - 1000 * 60 * 15,
//     bots: [
//       {
//         id: 'bot-8-1',
//         name: 'News Aggregator',
//         type: 'news_aggregation',
//         description: 'Collects and analyzes financial news',
//         gate: 'rss',
//         maxTimeRequest: 3000,
//         timeRequest: 1000,
//         status: 'closed',
//         sendData: false,
//         isStarted: false
//       }
//     ],
//     status: 'closed',
//   }
// ];
//
// export const serverStabs_3 = [
//   {
//     id: 1,
//     authorizationData: 'AuthToken_XYZ123',
//     version: 'v1.0.3',
//     timestamp: Date.now() + 1000 * 60 * 3,
//     bots: [
//       {
//         id: 'bot-s3-1',
//         name: 'Crypto Trader Pro',
//         type: 'crypto_trading',
//         description: 'Advanced crypto trading algorithm',
//         gate: 'binance',
//         maxTimeRequest: 5000,
//         timeRequest: 1500,
//         status: 'active',
//         sendData: true,
//         isStarted: true
//       },
//       {
//         id: 'bot-s3-2',
//         name: 'Market Data Collector',
//         type: 'market_data',
//         description: 'High-frequency market data collection',
//         gate: 'coinbase',
//         maxTimeRequest: 3000,
//         timeRequest: 800,
//         status: 'active',
//         sendData: true,
//         isStarted: true
//       }
//     ],
//     status: 'active',
//     type: 'crypto_trading'
//   },
//   {
//     id: 2,
//     authorizationData: 'AuthToken_ABC456',
//     version: 'v1.0.2',
//     timestamp: Date.now() - 1000 * 90,
//     bots: [
//       {
//         id: 'bot-s3-3',
//         name: 'Forex Data Miner',
//         type: 'forex_parsing',
//         description: 'Real-time forex market data parsing',
//         gate: 'oanda',
//         maxTimeRequest: 4000,
//         timeRequest: 1200,
//         status: 'closed',
//         sendData: false,
//         isStarted: false
//       },
//       {
//         id: 'bot-s3-4',
//         name: 'Currency Analyzer',
//         type: 'forex_analysis',
//         description: 'Advanced currency pair analysis',
//         gate: 'mt4',
//         maxTimeRequest: 6000,
//         timeRequest: 1800,
//         status: 'closed',
//         sendData: false,
//         isStarted: false
//       },
//       {
//         id: 'bot-s3-5',
//         name: 'Forex Signal Generator',
//         type: 'signal_generation',
//         description: 'Generates forex trading signals',
//         gate: 'internal',
//         maxTimeRequest: 3000,
//         timeRequest: 900,
//         status: 'closed',
//         sendData: false,
//         isStarted: false
//       },
//       {
//         id: 'bot-s3-6',
//         name: 'Risk Calculator',
//         type: 'risk_management',
//         description: 'Calculates position risk for forex',
//         gate: 'local',
//         maxTimeRequest: 15000,
//         timeRequest: 4500,
//         status: 'closed',
//         sendData: false,
//         isStarted: false
//       }
//     ],
//     status: 'closed',
//     type: 'forex_parsing'
//   },
//   {
//     id: 3,
//     authorizationData: 'AuthToken_DEF789',
//     version: 'v1.0.4',
//     timestamp: Date.now() + 1000 * 60 * 10,
//     bots: [
//       {
//         id: 'bot-s3-6',
//         name: 'Risk Calculator',
//         type: 'risk_management',
//         description: 'Calculates position risk for forex',
//         gate: 'local',
//         maxTimeRequest: 15000,
//         timeRequest: 4500,
//         status: 'closed',
//         sendData: false,
//         isStarted: false
//       },
//     ],
//     status: 'pending',
//     type: 'arbitrage_detection'
//   },
//   {
//     id: 4,
//     authorizationData: 'AuthToken_GHI012',
//     version: 'v1.0.1',
//     timestamp: Date.now() - 1000 * 60 * 5,
//     bots: [{
//       id: 'bot-s3-6',
//       name: 'Risk Calculator',
//       type: 'risk_management',
//       description: 'Calculates position risk for forex',
//       gate: 'local',
//       maxTimeRequest: 15000,
//       timeRequest: 4500,
//       status: 'closed',
//       sendData: false,
//       isStarted: false
//     },
//       {
//         id: 'bot-s3-6',
//         name: 'Risk Calculator',
//         type: 'risk_management',
//         description: 'Calculates position risk for forex',
//         gate: 'local',
//         maxTimeRequest: 15000,
//         timeRequest: 4500,
//         status: 'closed',
//         sendData: false,
//         isStarted: false
//       },
//     ],
//     status: 'error',
//     type: 'market_making'
//   },
//   {
//     id: 5,
//     authorizationData: 'AuthToken_JKL345',
//     version: 'v1.0.5',
//     timestamp: Date.now() + 1000 * 60 * 30,
//     bots: [],
//     status: 'active',
//     type: 'liquidity_monitoring'
//   },
//   {
//     id: 6,
//     authorizationData: 'AuthToken_MNO678',
//     version: 'v1.0.0',
//     timestamp: Date.now() - 1000 * 60 * 60,
//     bots: [
//       {
//         id: 'bot-s3-4',
//         name: 'Currency Analyzer',
//         type: 'forex_analysis',
//         description: 'Advanced currency pair analysis',
//         gate: 'mt4',
//         maxTimeRequest: 6000,
//         timeRequest: 1800,
//         status: 'closed',
//         sendData: false,
//         isStarted: false
//       },
//       {
//         id: 'bot-s3-5',
//         name: 'Forex Signal Generator',
//         type: 'signal_generation',
//         description: 'Generates forex trading signals',
//         gate: 'internal',
//         maxTimeRequest: 3000,
//         timeRequest: 900,
//         status: 'closed',
//         sendData: false,
//         isStarted: false
//       }
//     ],
//     status: 'error',
//     type: 'price_tracking'
//   },
//   {
//     id: 7,
//     authorizationData: 'AuthToken_PQR901',
//     version: 'v1.0.3',
//     timestamp: Date.now() + 1000 * 60 * 2,
//     bots: [
//       {
//         id: 'bot-s3-4',
//         name: 'Currency Analyzer',
//         type: 'forex_analysis',
//         description: 'Advanced currency pair analysis',
//         gate: 'mt4',
//         maxTimeRequest: 6000,
//         timeRequest: 1800,
//         status: 'closed',
//         sendData: false,
//         isStarted: false
//       },
//       {
//         id: 'bot-s3-5',
//         name: 'Forex Signal Generator',
//         type: 'signal_generation',
//         description: 'Generates forex trading signals',
//         gate: 'internal',
//         maxTimeRequest: 3000,
//         timeRequest: 900,
//         status: 'closed',
//         sendData: false,
//         isStarted: false
//       }
//     ],
//     status: 'pending',
//     type: 'volume_analysis'
//   },
//   {
//     id: 8,
//     authorizationData: 'AuthToken_STU234',
//     version: 'v1.0.2',
//     timestamp: Date.now() - 1000 * 60 * 15,
//     bots: [
//       {
//         id: 'bot-s3-4',
//         name: 'Currency Analyzer',
//         type: 'forex_analysis',
//         description: 'Advanced currency pair analysis',
//         gate: 'mt4',
//         maxTimeRequest: 6000,
//         timeRequest: 1800,
//         status: 'closed',
//         sendData: false,
//         isStarted: false
//       },
//       {
//         id: 'bot-s3-5',
//         name: 'Forex Signal Generator',
//         type: 'signal_generation',
//         description: 'Generates forex trading signals',
//         gate: 'internal',
//         maxTimeRequest: 3000,
//         timeRequest: 900,
//         status: 'closed',
//         sendData: false,
//         isStarted: false
//       }
//     ],
//     status: 'closed',
//     type: 'order_book_parsing'
//   },
//   {
//     id: 9,
//     authorizationData: 'AuthToken_VWX567',
//     version: 'v1.1.0',
//     timestamp: Date.now() + 1000 * 60 * 45,
//     bots: [
//       {
//         id: 'bot-s3-4',
//         name: 'Currency Analyzer',
//         type: 'forex_analysis',
//         description: 'Advanced currency pair analysis',
//         gate: 'mt4',
//         maxTimeRequest: 6000,
//         timeRequest: 1800,
//         status: 'closed',
//         sendData: false,
//         isStarted: false
//       },
//       {
//         id: 'bot-s3-5',
//         name: 'Forex Signal Generator',
//         type: 'signal_generation',
//         description: 'Generates forex trading signals',
//         gate: 'internal',
//         maxTimeRequest: 3000,
//         timeRequest: 900,
//         status: 'closed',
//         sendData: false,
//         isStarted: false
//       }
//     ],
//     status: 'active',
//     type: 'derivatives_trading'
//   },
//   {
//     id: 10,
//     authorizationData: 'AuthToken_YZA890',
//     version: 'v1.0.8',
//     timestamp: Date.now() - 1000 * 60 * 25,
//     bots: [
//       {
//         id: 'bot-s3-4',
//         name: 'Currency Analyzer',
//         type: 'forex_analysis',
//         description: 'Advanced currency pair analysis',
//         gate: 'mt4',
//         maxTimeRequest: 6000,
//         timeRequest: 1800,
//         status: 'closed',
//         sendData: false,
//         isStarted: false
//       },
//       {
//         id: 'bot-s3-5',
//         name: 'Forex Signal Generator',
//         type: 'signal_generation',
//         description: 'Generates forex trading signals',
//         gate: 'internal',
//         maxTimeRequest: 3000,
//         timeRequest: 900,
//         status: 'closed',
//         sendData: false,
//         isStarted: false
//       }
//     ],
//     status: 'pending',
//     type: 'yield_farming'
//   },
//   {
//     id: 11,
//     authorizationData: 'AuthToken_BCD123',
//     version: 'v1.0.6',
//     timestamp: Date.now() + 1000 * 60 * 8,
//     bots: [
//       {
//         id: 'bot-s3-4',
//         name: 'Currency Analyzer',
//         type: 'forex_analysis',
//         description: 'Advanced currency pair analysis',
//         gate: 'mt4',
//         maxTimeRequest: 6000,
//         timeRequest: 1800,
//         status: 'closed',
//         sendData: false,
//         isStarted: false
//       },
//       {
//         id: 'bot-s3-5',
//         name: 'Forex Signal Generator',
//         type: 'signal_generation',
//         description: 'Generates forex trading signals',
//         gate: 'internal',
//         maxTimeRequest: 3000,
//         timeRequest: 900,
//         status: 'closed',
//         sendData: false,
//         isStarted: false
//       }
//     ],
//     status: 'active',
//     type: 'lending_monitoring'
//   },
//   {
//     id: 12,
//     authorizationData: 'AuthToken_EFG456',
//     version: 'v1.0.7',
//     timestamp: Date.now() - 1000 * 60 * 40,
//     bots: [
//       {
//         id: 'bot-s3-4',
//         name: 'Currency Analyzer',
//         type: 'forex_analysis',
//         description: 'Advanced currency pair analysis',
//         gate: 'mt4',
//         maxTimeRequest: 6000,
//         timeRequest: 1800,
//         status: 'closed',
//         sendData: false,
//         isStarted: false
//       },
//       {
//         id: 'bot-s3-5',
//         name: 'Forex Signal Generator',
//         type: 'signal_generation',
//         description: 'Generates forex trading signals',
//         gate: 'internal',
//         maxTimeRequest: 3000,
//         timeRequest: 900,
//         status: 'closed',
//         sendData: false,
//         isStarted: false
//       }
//     ],
//     status: 'closed',
//     type: 'cross_exchange'
//   },
//   {
//     id: 13,
//     authorizationData: 'AuthToken_HIJ789',
//     version: 'v1.0.9',
//     timestamp: Date.now() + 1000 * 60 * 12,
//     bots: [
//       {
//         id: 'bot-s3-4',
//         name: 'Currency Analyzer',
//         type: 'forex_analysis',
//         description: 'Advanced currency pair analysis',
//         gate: 'mt4',
//         maxTimeRequest: 6000,
//         timeRequest: 1800,
//         status: 'closed',
//         sendData: false,
//         isStarted: false
//       },
//       {
//         id: 'bot-s3-5',
//         name: 'Forex Signal Generator',
//         type: 'signal_generation',
//         description: 'Generates forex trading signals',
//         gate: 'internal',
//         maxTimeRequest: 3000,
//         timeRequest: 900,
//         status: 'closed',
//         sendData: false,
//         isStarted: false
//       },
//       {
//         id: 'bot-s3-5',
//         name: 'Forex Signal Generator',
//         type: 'signal_generation',
//         description: 'Generates forex trading signals',
//         gate: 'internal',
//         maxTimeRequest: 3000,
//         timeRequest: 900,
//         status: 'closed',
//         sendData: false,
//         isStarted: false
//       },
//     ],
//     status: 'pending',
//     type: 'risk_management'
//   },
//   {
//     id: 14,
//     authorizationData: 'AuthToken_KLM012',
//     version: 'v1.1.2',
//     timestamp: Date.now() - 1000 * 60 * 8,
//     bots: [
//       {
//         id: 'bot-s3-4',
//         name: 'Currency Analyzer',
//         type: 'forex_analysis',
//         description: 'Advanced currency pair analysis',
//         gate: 'mt4',
//         maxTimeRequest: 6000,
//         timeRequest: 1800,
//         status: 'closed',
//         sendData: false,
//         isStarted: false
//       },
//       {
//         id: 'bot-s3-5',
//         name: 'Forex Signal Generator',
//         type: 'signal_generation',
//         description: 'Generates forex trading signals',
//         gate: 'internal',
//         maxTimeRequest: 3000,
//         timeRequest: 900,
//         status: 'closed',
//         sendData: false,
//         isStarted: false
//       },
//       {
//         id: 'bot-s3-5',
//         name: 'Forex Signal Generator',
//         type: 'signal_generation',
//         description: 'Generates forex trading signals',
//         gate: 'internal',
//         maxTimeRequest: 3000,
//         timeRequest: 900,
//         status: 'closed',
//         sendData: false,
//         isStarted: false
//       },
//       {
//         id: 'bot-s3-5',
//         name: 'Forex Signal Generator',
//         type: 'signal_generation',
//         description: 'Generates forex trading signals',
//         gate: 'internal',
//         maxTimeRequest: 3000,
//         timeRequest: 900,
//         status: 'closed',
//         sendData: false,
//         isStarted: false
//       },
//     ],
//     status: 'error',
//     type: 'portfolio_tracking'
//   },
//   {
//     id: 15,
//     authorizationData: 'AuthToken_NOP345',
//     version: 'v1.0.4',
//     timestamp: Date.now() + 1000 * 60 * 20,
//     bots: [
//       {
//         id: 'bot-s3-4',
//         name: 'Currency Analyzer',
//         type: 'forex_analysis',
//         description: 'Advanced currency pair analysis',
//         gate: 'mt4',
//         maxTimeRequest: 6000,
//         timeRequest: 1800,
//         status: 'closed',
//         sendData: false,
//         isStarted: false
//       },
//       {
//         id: 'bot-s3-5',
//         name: 'Forex Signal Generator',
//         type: 'signal_generation',
//         description: 'Generates forex trading signals',
//         gate: 'internal',
//         maxTimeRequest: 3000,
//         timeRequest: 900,
//         status: 'closed',
//         sendData: false,
//         isStarted: false
//       },
//       {
//         id: 'bot-s3-5',
//         name: 'Forex Signal Generator',
//         type: 'signal_generation',
//         description: 'Generates forex trading signals',
//         gate: 'internal',
//         maxTimeRequest: 3000,
//         timeRequest: 900,
//         status: 'closed',
//         sendData: false,
//         isStarted: false
//       },
//     ],
//     status: 'active',
//     type: 'technical_analysis'
//   },
//   {
//     id: 16,
//     authorizationData: 'AuthToken_QRS678',
//     version: 'v1.1.1',
//     timestamp: Date.now() - 1000 * 60 * 35,
//     bots: [
//       {
//         id: 'bot-s3-5',
//         name: 'Forex Signal Generator',
//         type: 'signal_generation',
//         description: 'Generates forex trading signals',
//         gate: 'internal',
//         maxTimeRequest: 3000,
//         timeRequest: 900,
//         status: 'closed',
//         sendData: false,
//         isStarted: false
//       },
//     ],
//     status: 'closed',
//     type: 'sentiment_analysis'
//   },
//   {
//     id: 17,
//     authorizationData: 'AuthToken_TUV901',
//     version: 'v1.0.3',
//     timestamp: Date.now() + 1000 * 60 * 5,
//     bots: [
//       {
//         id: 'bot-s3-4',
//         name: 'Currency Analyzer',
//         type: 'forex_analysis',
//         description: 'Advanced currency pair analysis',
//         gate: 'mt4',
//         maxTimeRequest: 6000,
//         timeRequest: 1800,
//         status: 'closed',
//         sendData: false,
//         isStarted: false
//       },
//       {
//         id: 'bot-s3-5',
//         name: 'Forex Signal Generator',
//         type: 'signal_generation',
//         description: 'Generates forex trading signals',
//         gate: 'internal',
//         maxTimeRequest: 3000,
//         timeRequest: 900,
//         status: 'closed',
//         sendData: false,
//         isStarted: false
//       },
//       {
//         id: 'bot-s3-5',
//         name: 'Forex Signal Generator',
//         type: 'signal_generation',
//         description: 'Generates forex trading signals',
//         gate: 'internal',
//         maxTimeRequest: 3000,
//         timeRequest: 900,
//         status: 'closed',
//         sendData: false,
//         isStarted: false
//       },
//       {
//         id: 'bot-s3-5',
//         name: 'Forex Signal Generator',
//         type: 'signal_generation',
//         description: 'Generates forex trading signals',
//         gate: 'internal',
//         maxTimeRequest: 3000,
//         timeRequest: 900,
//         status: 'closed',
//         sendData: false,
//         isStarted: false
//       },
//     ],
//     status: 'pending',
//     type: 'news_aggregation'
//   },
//   {
//     id: 18,
//     authorizationData: 'AuthToken_WXY234',
//     version: 'v1.0.5',
//     timestamp: Date.now() - 1000 * 60 * 50,
//     bots: [
//       {
//         id: 'bot-s3-4',
//         name: 'Currency Analyzer',
//         type: 'forex_analysis',
//         description: 'Advanced currency pair analysis',
//         gate: 'mt4',
//         maxTimeRequest: 6000,
//         timeRequest: 1800,
//         status: 'closed',
//         sendData: false,
//         isStarted: false
//       },
//       {
//         id: 'bot-s3-5',
//         name: 'Forex Signal Generator',
//         type: 'signal_generation',
//         description: 'Generates forex trading signals',
//         gate: 'internal',
//         maxTimeRequest: 3000,
//         timeRequest: 900,
//         status: 'closed',
//         sendData: false,
//         isStarted: false
//       }
//     ],
//     status: 'active',
//     type: 'api_monitoring'
//   },
//   {
//     id: 19,
//     authorizationData: 'AuthToken_ZAB567',
//     version: 'v1.1.3',
//     timestamp: Date.now() + 1000 * 60 * 15,
//     bots: [
//       {
//         id: 'bot-s3-4',
//         name: 'Currency Analyzer',
//         type: 'forex_analysis',
//         description: 'Advanced currency pair analysis',
//         gate: 'mt4',
//         maxTimeRequest: 6000,
//         timeRequest: 1800,
//         status: 'closed',
//         sendData: false,
//         isStarted: false
//       },
//       {
//         id: 'bot-s3-5',
//         name: 'Forex Signal Generator',
//         type: 'signal_generation',
//         description: 'Generates forex trading signals',
//         gate: 'internal',
//         maxTimeRequest: 3000,
//         timeRequest: 900,
//         status: 'closed',
//         sendData: false,
//         isStarted: false
//       }
//     ],
//     status: 'pending',
//     type: 'blockchain_analytics'
//   },
//   {
//     id: 20,
//     authorizationData: 'AuthToken_CDE890',
//     version: 'v1.0.2',
//     timestamp: Date.now() - 1000 * 60 * 28,
//     bots: [
//       {
//         id: 'bot-s3-4',
//         name: 'Currency Analyzer',
//         type: 'forex_analysis',
//         description: 'Advanced currency pair analysis',
//         gate: 'mt4',
//         maxTimeRequest: 6000,
//         timeRequest: 1800,
//         status: 'closed',
//         sendData: false,
//         isStarted: false
//       },
//       {
//         id: 'bot-s3-5',
//         name: 'Forex Signal Generator',
//         type: 'signal_generation',
//         description: 'Generates forex trading signals',
//         gate: 'internal',
//         maxTimeRequest: 3000,
//         timeRequest: 900,
//         status: 'closed',
//         sendData: false,
//         isStarted: false
//       }
//     ],
//     status: 'closed',
//     type: 'compliance_checking'
//   }
// ];
