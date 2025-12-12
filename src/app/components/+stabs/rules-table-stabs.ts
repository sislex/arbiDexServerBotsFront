export const IRule_1 = [{
  id: "botRule2",

  botParams: {
    botType: "uniswapScanner",
    paused: true,
    isRepeat: false,
    maxActions: 1,
  },

  actionParams: {
    actionType: 'GET_ARBITRUM_UNISWAP_V2_QUOTES',
    k: 7,
  }
}];

export const IRule_2 = [
  {
    id: "botRule1",
    botParams: {
      botType: "uniswapScanner",
      paused: false,
      isRepeat: true,
      delayBetweenRepeat: 3000,
      maxActions: 10,
    },
    actionParams: {
      actionType: 'GET_ARBITRUM_UNISWAP_V3_QUOTES',
      i: 1,
    }
  },

  {
    id: "botRule2",
    botParams: {
      botType: "uniswapScanner",
      paused: true,
      isRepeat: false,
      maxActions: 1,
    },
    actionParams: {
      actionType: 'GET_ARBITRUM_UNISWAP_V2_QUOTES',
      k: 7,
    }
  },

  {
    id: "botRule3",
    botParams: {
      botType: "uniswapScanner",
      paused: false,
      isRepeat: true,
      delayBetweenRepeat: 5000,
      maxActions: 5,
    },
    actionParams: {
      actionType: 'GET_ARBITRUM_UNISWAP_V3_QUOTES',
      i: 10,
    }
  },

  {
    id: "botRule4",
    botParams: {
      botType: "uniswapScanner",
      paused: false,
      isRepeat: false,
      maxActions: 1,
    },
    actionParams: {
      actionType: 'GET_ARBITRUM_UNISWAP_V2_QUOTES',
      k: 3,
    }
  },

  {
    id: "botRule5",
    botParams: {
      botType: "uniswapScanner",
      paused: true,
      isRepeat: true,
      delayBetweenRepeat: 10000,
      maxActions: 20,
    },
    actionParams: {
      actionType: 'GET_ARBITRUM_UNISWAP_V3_QUOTES',
      i: 99,
    }
  }
];

