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
  status: '',
  id: "",
  running: false,
  createdAt: "",
  jobCount: 0,
  errorCount: 0,
  lastJobTimeStart: "",
  lastJobTimeFinish: "",
  lastLatency: 0,
  lastJobResult: {
    ok: false,
    latencyMs: 0,
    result: {
      quoteExactInputSingle: {
        amountOut: "",
        sqrtPriceX96After: "",
        initializedTicksCrossed: "",
        gasEstimate: ""
      },
      quoteExactOutputSingle: {
        amountIn: "",
        sqrtPriceX96After: "",
        initializedTicksCrossed: "",
        gasEstimate: ""
      }
    },
    blockNumber: 0
  }
};
