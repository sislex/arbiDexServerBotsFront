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
  jobParams: {
    jobType: "",
    i: 0
  },
  botParams: {
    botType: "",
    delayBetweenRepeat: 0,
    isRepeat: false,
    maxJobs: 0,
    paused: false
  }
};
