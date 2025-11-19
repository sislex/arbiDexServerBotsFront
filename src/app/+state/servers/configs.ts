export const ApiListConfig = [
  {
    type: 'GET',
    endpoint: '.../bots/get-all',
    description: 'Это данные на управление, надо определится с описанием'
  },
  {
    type: 'GET',
    endpoint: '.../info',
    description: 'Get server info'
  },
  {
    type: 'GET',
    endpoint: '.../info/bots-types-list',
    description: 'Get bot types list'
  },
  {
    type: 'GET',
    endpoint: '.../info/bots-actions-list',
    description: 'Get action types list'
  },
  {
    type: 'GET',
    endpoint: '.../bot/:botId/settings',
    description: 'Get bot rules'
  },
  {
    type: 'PUT',
    endpoint: '.../bot/:botId/settings',
    description: 'Edit bot rules'
  },
  {
    type: 'GET',
    endpoint: '.../bot/:botId/params',
    description: 'Get all bot params'
  },
  {
    type: 'POST',
    endpoint: '...bot/:botId/pause',
    description: 'Set pause: true/false for bot'
  },
];

export const serverListConfig = [
  {
    ip: '45.135.182.251',
    port: '1005',
    name: 'UNREAL_SERVER',
  },
  {
    ip: '45.135.182.251',
    port: '1001',
    name: 'FIRST_REAL_SERVER',
  },
]

export const emptyAsyncResponse = <Example>(response: Example) => ({
  startTime: null,
  loadingTime: null,
  isLoading: false,
  isLoaded: false,
  response
});

export const emptyServerResponse = {
  ip: '',
  port: '',
  version: '',
  status: 'active',
  timestampFinish: '',
  timestampStart: '',
  botsCount: 0
};

export const emptyBotInfoResponse = {
  id: "",
  actionParams: {
    actionType: "",
    i: 0
  },
  botParams: {
    botType: "",
    delayBetweenRepeat: 0,
    isRepeat: false,
    maxActions: 0,
    paused: false
  }
};
