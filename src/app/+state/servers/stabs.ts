export const mainStabsServers = [
  {
    ip: '192.168.1.100',
    port: '8080',
    name: 'alphaServer',
    version: '1.2.3',
    status: 'active',
    timestamp: Date.now() - 1000 * 60 * 28,
    bots: [
      {
        id: 'bot-cb-001',
        name: "Coinbase Pro Scraper",
        type: "Crypto API",
        description: "REST API parser for major cryptocurrency pairs with WebSocket support for live market data",
        gate: 'Gate-A',
        maxTimeRequest: 2500,
        timeRequest: 1800,
        status: 'active',
        sendData: true,
        isStarted: true,
      },
      {
        id: 'bot-fx-001',
        name: 'Currency Analyzer',
        type: 'forex_analysis',
        description: 'Advanced currency pair analysis with machine learning',
        gate: 'Gate-B',
        maxTimeRequest: 6000,
        timeRequest: 1800,
        status: 'closed',
        sendData: false,
        isStarted: false
      },
      {
        id: 'bot-sg-001',
        name: 'Forex Signal Generator',
        type: 'signal_generation',
        description: 'Generates forex trading signals based on technical indicators',
        gate: 'Gate-A',
        maxTimeRequest: 3000,
        timeRequest: 900,
        status: 'closed',
        sendData: false,
        isStarted: false
      }
    ]
  },
  {
    ip: '192.168.1.101',
    port: '8081',
    name: 'betaServer',
    version: '1.2.4',
    status: 'active',
    timestamp: Date.now() - 1000 * 60 * 15,
    bots: [
      {
        id: 'bot-binance-001',
        name: "Binance Market Data",
        type: "Crypto API",
        description: "Real-time cryptocurrency data from Binance exchange with order book tracking",
        gate: 'Gate-C',
        maxTimeRequest: 2000,
        timeRequest: 1500,
        status: 'active',
        sendData: true,
        isStarted: true,
      },
      {
        id: 'bot-stock-001',
        name: 'Stock Market Monitor',
        type: 'equity_analysis',
        description: 'Monitors major stock indices and individual equities',
        gate: 'Gate-D',
        maxTimeRequest: 5000,
        timeRequest: 2500,
        status: 'active',
        sendData: true,
        isStarted: true
      },
      {
        id: 'bot-news-001',
        name: 'Financial News Aggregator',
        type: 'news_analysis',
        description: 'Collects and analyzes financial news for market sentiment',
        gate: 'Gate-B',
        maxTimeRequest: 4000,
        timeRequest: 1200,
        status: 'active',
        sendData: true,
        isStarted: true
      }
    ]
  },
]

export const serversStabs = [
  {
    botsControl: [
      {
        id: 'req-001',
        gate: 'gate_alpha',
        maxTimeRequest: 2500,
        TimeRequest: 1800,
        status: 'active',
        isSendData: true,
        isStart: true,
      },
      {
        id: 'req-002',
        gate: 'gate_beta',
        maxTimeRequest: 3000,
        TimeRequest: 2200,
        status: 'active',
        isSendData: false,
        isStart: true,
      },
      {
        id: 'req-003',
        gate: 'gate_gamma',
        maxTimeRequest: 2000,
        TimeRequest: 1500,
        status: 'inactive',
        isSendData: true,
        isStart: false,
      },
      {
        id: 'req-004',
        gate: 'gate_delta',
        maxTimeRequest: 3500,
        TimeRequest: 3200,
        status: 'active',
        isSendData: false,
        isStart: true,
      }
    ],
    gateList: [
      {
        ip: '192.168.1.10',
        name: 'gate_alpha',
      },
      {
        ip: '192.168.1.11',
        name: 'gate_beta',
      },
      {
        ip: '192.168.1.12',
        name: 'gate_gamma',
      }
    ],
    botTypesList: [
      {
        id: '1',
        label: 'Data Collector',
        type: 'collector',
        description: 'Collects and processes incoming data streams',
      },
      {
        id: '2',
        label: 'Monitor Bot',
        type: 'monitor',
        description: 'Monitors system health and performance metrics',
      },
      {
        id: '3',
        label: 'Analyzer Bot',
        type: 'analyzer',
        description: 'Analyzes collected data for patterns and anomalies',
      }
    ],
    actionTypesList: [
      {
        id: '1',
        label: 'Data Fetch',
        type: 'fetch',
        description: 'Retrieves data from specified sources',
      },
      {
        id: '2',
        label: 'Status Check',
        type: 'status_check',
        description: 'Verifies system and component status',
      },
      {
        id: '3',
        label: 'Report Generate',
        type: 'report',
        description: 'Creates detailed analysis reports',
      }
    ],
    ip: '192.169.0.0',
    port: '6060',
    version: '32.2.123',
    timestampFinish: '1902103200',
    timestampStart: '1759494600',
    status: 'active'
  },
  {
    botsControl: [
      {
        id: 'req-101',
        gate: 'gate_epsilon',
        maxTimeRequest: 2800,
        TimeRequest: 2100,
        status: 'active',
        isSendData: true,
        isStart: true,
      },
      {
        id: 'req-102',
        gate: 'gate_zeta',
        maxTimeRequest: 3200,
        TimeRequest: 2900,
        status: 'active',
        isSendData: true,
        isStart: true,
      },
      {
        id: 'req-103',
        gate: 'gate_eta',
        maxTimeRequest: 2400,
        TimeRequest: 1900,
        status: 'maintenance',
        isSendData: false,
        isStart: false,
      }
    ],
    gateList: [
      {
        ip: '192.168.2.20',
        name: 'gate_epsilon',
      },
      {
        ip: '192.168.2.21',
        name: 'gate_zeta',
      },
      {
        ip: '192.168.2.22',
        name: 'gate_eta',
      },
      {
        ip: '192.168.2.23',
        name: 'gate_theta',
      }
    ],
    botTypesList: [
      {
        id: '4',
        label: 'Security Scanner',
        type: 'security',
        description: 'Scans for security vulnerabilities and threats',
      },
      {
        id: '5',
        label: 'Backup Manager',
        type: 'backup',
        description: 'Manages data backup and recovery operations',
      },
      {
        id: '6',
        label: 'Notification Bot',
        type: 'notifier',
        description: 'Sends alerts and notifications to users',
      }
    ],
    actionTypesList: [
      {
        id: '4',
        label: 'Security Scan',
        type: 'security_scan',
        description: 'Performs comprehensive security scanning',
      },
      {
        id: '5',
        label: 'Backup Operation',
        type: 'backup',
        description: 'Executes data backup procedures',
      },
      {
        id: '6',
        label: 'Alert Send',
        type: 'alert',
        description: 'Distributes alert messages',
      }
    ],
    ip: '192.169.0.1',
    port: '6060',
    version: '31.5.87',
    timestampFinish: '1902154800',
    timestampStart: '1759537200',
    status: 'active'
  },
  {
    botsControl: [
      {
        id: 'req-201',
        gate: 'gate_iota',
        maxTimeRequest: 2600,
        TimeRequest: 2000,
        status: 'active',
        isSendData: true,
        isStart: true,
      },
      {
        id: 'req-202',
        gate: 'gate_kappa',
        maxTimeRequest: 3100,
        TimeRequest: 2800,
        status: 'inactive',
        isSendData: false,
        isStart: false,
      },
      {
        id: 'req-203',
        gate: 'gate_lambda',
        maxTimeRequest: 2900,
        TimeRequest: 2300,
        status: 'active',
        isSendData: true,
        isStart: true,
      },
      {
        id: 'req-204',
        gate: 'gate_mu',
        maxTimeRequest: 2700,
        TimeRequest: 2100,
        status: 'active',
        isSendData: false,
        isStart: true,
      },
      {
        id: 'req-205',
        gate: 'gate_nu',
        maxTimeRequest: 3300,
        TimeRequest: 3000,
        status: 'maintenance',
        isSendData: true,
        isStart: false,
      }
    ],
    gateList: [
      {
        ip: '192.168.3.30',
        name: 'gate_iota',
      },
      {
        ip: '192.168.3.31',
        name: 'gate_kappa',
      },
      {
        ip: '192.168.3.32',
        name: 'gate_lambda',
      }
    ],
    botTypesList: [
      {
        id: '7',
        label: 'Data Cleaner',
        type: 'cleaner',
        description: 'Cleans and optimizes database storage',
      },
      {
        id: '8',
        label: 'API Handler',
        type: 'api_handler',
        description: 'Manages API requests and responses',
      },
      {
        id: '2',
        label: 'Monitor Bot',
        type: 'monitor',
        description: 'Monitors system health and performance metrics',
      }
    ],
    actionTypesList: [
      {
        id: '7',
        label: 'Data Cleanup',
        type: 'cleanup',
        description: 'Performs data cleanup and optimization',
      },
      {
        id: '8',
        label: 'API Process',
        type: 'api_process',
        description: 'Handles API communication workflows',
      },
      {
        id: '2',
        label: 'Status Check',
        type: 'status_check',
        description: 'Verifies system and component status',
      }
    ],
    ip: '192.169.0.3',
    port: '6060',
    version: '33.1.45',
    timestampFinish: '1902206400',
    timestampStart: '1759620000',
    status: 'active'
  }
];
