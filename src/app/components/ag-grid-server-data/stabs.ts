const addDaysUTC = (days: number): string => {
  const now = new Date();
  const utcNow = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + days,
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds()
  );
  return new Date(utcNow).toISOString();
};

export const serverStabs_1 = {
  ip: '192.168.0.10',
  port: '6060',
  version: '1.0.0',
  status: 'active',
  timestampStart: addDaysUTC(-3),
  timestampFinish: addDaysUTC(3),
  botsCount: 2,
};

export const serverStabs_2 = [
  {
    ip: '192.168.0.11',
    port: '6061',
    version: '1.0.0',
    status: 'active',
    timestampStart: addDaysUTC(-2),
    timestampFinish: addDaysUTC(2),
    botsCount: 4,
  },
  {
    ip: '192.168.0.12',
    port: '6062',
    version: '1.2.1',
    status: 'active',
    timestampStart: addDaysUTC(-1),
    timestampFinish: addDaysUTC(1),
    botsCount: 2,
  },
  {
    ip: '192.168.0.13',
    port: '6063',
    version: '2.0.0',
    status: 'active',
    timestampStart: addDaysUTC(-3),
    timestampFinish: addDaysUTC(0),
    botsCount: 5,
  },
  {
    ip: '192.168.0.14',
    port: '6064',
    version: '2.1.4',
    status: 'active',
    timestampStart: addDaysUTC(-5),
    timestampFinish: addDaysUTC(-2),
    botsCount: 6,
  },
  {
    ip: '192.168.0.15',
    port: '6065',
    version: '3.0.0',
    status: 'active',
    timestampStart: addDaysUTC(-4),
    timestampFinish: addDaysUTC(4),
    botsCount: 9,
  },
];

export const serverStabs_3 = {
  ip: '192.168.0.10',
  port: '6060',
  version: '',
  status: 'error',
  timestampStart: addDaysUTC(-10),
  timestampFinish: addDaysUTC(1),
  botsCount: 0,
};
