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
    endpoint: '.../bot/:id/settings',
    description: 'Get bot rules'
  },
  {
    type: 'PUT',
    endpoint: '.../bot/:id/settings',
    description: 'Edit bot rules'
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
