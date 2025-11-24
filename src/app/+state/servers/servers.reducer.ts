import {createReducer, on} from '@ngrx/store';
import * as ServersActions from './servers.actions';
import {IConfig, IServerData, IActiveElementData} from '../../models/servers';
import {
  emptyAsyncResponse,
  emptyBotInfoResponse,
  emptyServerResponse,
  serverListConfig
} from './configs';

export const SERVERS_FEATURE_KEY = 'servers';

export interface ServersState {
  featureName: string;
  config: IConfig;
  serverListResponse: IServerData[];
  activeElementData: IActiveElementData;
}

export interface ServersPartialState {
  readonly [SERVERS_FEATURE_KEY]: ServersState;
}

export const initialState: ServersState = {
  featureName: 'server manager',
  config: {
    serverList: serverListConfig,
    apiList: emptyAsyncResponse([]),
  },
  serverListResponse: [],
  activeElementData: {
    serverData: emptyAsyncResponse(emptyServerResponse),
    botTypesList: emptyAsyncResponse([]),
    jobTypesList: emptyAsyncResponse([]),
    gateList: [],
    botControlList: emptyAsyncResponse([]),
    activeBot: {
      botInfo: emptyAsyncResponse(emptyBotInfoResponse),
      botResultList: emptyAsyncResponse([]),
      botErrorList: emptyAsyncResponse([])
    }
  },
};


export const serversReducer = createReducer(
  initialState,
  on(ServersActions.loadServerList, (state) => ({
    ...state,
    activeElementData: {
      ...state.activeElementData,
      serverData: {
        ...state.activeElementData.serverData,
        startTime:  Date.now(),
        isLoading: true,
        isLoaded: false,
      }
    }
  })),
  on(ServersActions.loadServerListSuccess, (state, {response}) => ({
    ...state,
    activeElementData: {
      ...state.activeElementData,
      serverData: {
        ...state.activeElementData.serverData,
        loadingTime: Date.now() - state.activeElementData.serverData.startTime!,
        isLoading: false,
        isLoaded: true,
        response
      }
    }
  })),
  on(ServersActions.loadServerListFailure, (state, {error}) => ({
    ...state,
    activeElementData: {
      ...state.activeElementData,
      serverData: {
        ...state.activeElementData.serverData,
        loadingTime: Date.now() - state.activeElementData.serverData.startTime!,
        isLoading: false,
        isLoaded: true,
        error
      }
    }
  })),

  on(ServersActions.loadBotTypesList, (state) => ({
    ...state,
    activeElementData: {
      ...state.activeElementData,
      botTypesList: {
        ...state.activeElementData.botTypesList,
        startTime:  Date.now(),
        isLoading: true,
        isLoaded: false,
      }
    }
  })),
  on(ServersActions.loadBotTypesListSuccess, (state, {response}) => ({
    ...state,
    activeElementData: {
      ...state.activeElementData,
      botTypesList: {
        ...state.activeElementData.botTypesList,
        loadingTime: Date.now() - state.activeElementData.botTypesList.startTime!,
        isLoading: false,
        isLoaded: true,
        response
      }
    }
  })),
  on(ServersActions.loadBotTypesListFailure, (state, {error}) => ({
    ...state,
    activeElementData: {
      ...state.activeElementData,
      botTypesList: {
        ...state.activeElementData.botTypesList,
        loadingTime: Date.now() - state.activeElementData.botTypesList.startTime!,
        isLoading: false,
        isLoaded: true,
        error
      }
    }
  })),

  on(ServersActions.loadJobTypesList, (state) => ({
    ...state,
    activeElementData: {
      ...state.activeElementData,
      jobTypesList: {
        ...state.activeElementData.jobTypesList,
        startTime:  Date.now(),
        isLoading: true,
        isLoaded: false,
      }
    }
  })),
  on(ServersActions.loadJobTypesListSuccess, (state, {response}) => ({
    ...state,
    activeElementData: {
      ...state.activeElementData,
      jobTypesList: {
        ...state.activeElementData.jobTypesList,
        loadingTime: Date.now() - state.activeElementData.jobTypesList.startTime!,
        isLoading: false,
        isLoaded: true,
        response
      }
    }
  })),
  on(ServersActions.loadJobTypesListFailure, (state, {error}) => ({
    ...state,
    activeElementData: {
      ...state.activeElementData,
      jobTypesList: {
        ...state.activeElementData.jobTypesList,
        loadingTime: Date.now() - state.activeElementData.jobTypesList.startTime!,
        isLoading: false,
        isLoaded: true,
        error
      }
    }
  })),

  on(ServersActions.loadBotControlList, (state) => {
    const botControlList = state.activeElementData.botControlList;

    return {
      ...state,
      activeElementData: {
        ...state.activeElementData,
        botControlList: {
          ...botControlList,
          startTime: Date.now(),
          isLoading: true,
          isLoaded: false,
        },
      },
    };
  }),
  on(ServersActions.loadBotControlListSuccess, (state, { response }) => {
    const botControlList = state.activeElementData.botControlList;

    return {
      ...state,
      activeElementData: {
        ...state.activeElementData,
        botControlList: {
          ...botControlList,
          loadingTime: Date.now() - botControlList.startTime!,
          isLoading: false,
          isLoaded: true,
          response,
        },
      },
    };
  }),
  on(ServersActions.loadBotControlListFailure, (state, { error }) => {
    const botControlList = state.activeElementData.botControlList;

    return {
      ...state,
      activeElementData: {
        ...state.activeElementData,
        botControlList: {
          ...botControlList,
          loadingTime: Date.now() - botControlList.startTime!,
          isLoading: false,
          isLoaded: true,
          error,
        },
      },
    };
  }),


  on(ServersActions.loadBotControl, (state) => {
    const bot = state.activeElementData.activeBot;
    const botInfo = bot.botInfo;

    return {
      ...state,
      activeElementData: {
        ...state.activeElementData,
        activeBot: {
          ...bot,
          botInfo: {
            ...botInfo,
            startTime: Date.now(),
            isLoading: true,
            isLoaded: false,
          },
        },
      },
    };
  }),
  on(ServersActions.loadBotControlSuccess, (state, { response }) => {
    const bot = state.activeElementData.activeBot;
    const botInfo = bot.botInfo;

    return {
      ...state,
      activeElementData: {
        ...state.activeElementData,
        activeBot: {
          ...bot,
          botInfo: {
            ...botInfo,
            loadingTime: Date.now() - botInfo.startTime!,
            isLoading: false,
            isLoaded: true,
            response,
          },
          botResultList: {
            ...bot.botResultList,
            response: [
              ...bot.botResultList.response,
              ...response.botParams,
            ]
          },
        },
      },
    };
  }),
  on(ServersActions.loadBotControlFailure, (state, { error }) => {
    const bot = state.activeElementData.activeBot;
    const botInfo = bot.botInfo;

    return {
      ...state,
      activeElementData: {
        ...state.activeElementData,
        activeBot: {
          ...bot,
          botInfo: {
            ...botInfo,
            loadingTime: Date.now() - botInfo.startTime!,
            isLoading: false,
            isLoaded: true,
            error,
          },
        },
      },
    };
  }),


  on(ServersActions.loadBotParams, (state) => {
    const botResultList = state.activeElementData.activeBot.botResultList;

    return {
      ...state,
      activeElementData: {
        ...state.activeElementData,
        activeBot: {
          ...state.activeElementData.activeBot,
          botResultList: {
            ...botResultList,
            startTime: Date.now(),
            isLoading: true,
            isLoaded: false,
          },
        },
      },
    };
  }),
  on(ServersActions.loadBotParamsSuccess, (state, { response }) => {
    const botResultList = state.activeElementData.activeBot.botResultList;

    return {
      ...state,
      activeElementData: {
        ...state.activeElementData,
        activeBot: {
          ...state.activeElementData.activeBot,
          botResultList: {
            ...botResultList,
            loadingTime: Date.now() - botResultList.startTime!,
            isLoading: false,
            isLoaded: true,
            response: [...(botResultList.response || []), ...response],
          },
        },
      },
    };
  }),
  on(ServersActions.loadBotParamsFailure, (state, { error }) => {
    const botResultList = state.activeElementData.activeBot.botResultList;
    return {
      ...state,
      activeElementData: {
        ...state.activeElementData,
        activeBot: {
          ...state.activeElementData.activeBot,
          botResultList: {
            ...botResultList,
            loadingTime: Date.now() - botResultList.startTime!,
            isLoading: false,
            isLoaded: true,
            error,
          },
        },
      },
    };
  }),


  on(ServersActions.loadBotErrors, (state) => {
    const botErrorList = state.activeElementData.activeBot.botErrorList;

    return {
      ...state,
      activeElementData: {
        ...state.activeElementData,
        activeBot: {
          ...state.activeElementData.activeBot,
          botErrorList: {
            ...botErrorList,
            startTime: Date.now(),
            isLoading: true,
            isLoaded: false,
          },
        },
      },
    };
  }),
  on(ServersActions.loadBotErrorsSuccess, (state, { response }) => {
    const botErrorList = state.activeElementData.activeBot.botErrorList;

    return {
      ...state,
      activeElementData: {
        ...state.activeElementData,
        activeBot: {
          ...state.activeElementData.activeBot,
          botErrorList: {
            ...botErrorList,
            loadingTime: Date.now() - botErrorList.startTime!,
            isLoading: false,
            isLoaded: true,
            response: [...(botErrorList.response || []), ...response],
          },
        },
      },
    };
  }),
  on(ServersActions.loadBotErrorsFailure, (state, { error }) => {
    const botErrorList = state.activeElementData.activeBot.botErrorList;
    return {
      ...state,
      activeElementData: {
        ...state.activeElementData,
        activeBot: {
          ...state.activeElementData.activeBot,
          botErrorList: {
            ...botErrorList,
            loadingTime: Date.now() - botErrorList.startTime!,
            isLoading: false,
            isLoaded: true,
            error,
          },
        },
      },
    };
  }),

  on(ServersActions.setApiList, (state) => {
    return {
      ...state,
      config: {
        ...state.config,
        apiList: {
          ...state.config.apiList,
          startTime: Date.now(),
          isLoading: true,
          isLoaded: false,
        },
      },
    };
  }),
  on(ServersActions.setApiListSuccess, (state, { response }) => {
    return {
      ...state,
      config: {
        ...state.config,
        apiList: {
          ...state.config.apiList,
          loadingTime: Date.now() - state.config.apiList.startTime!,
          isLoading: false,
          isLoaded: true,
          response,
        },
      },
    };
  }),
  on(ServersActions.loadBotErrorsFailure, (state, { error }) => {
    return {
      ...state,
      config: {
        ...state.config,
        apiList: {
          ...state.config.apiList,
          loadingTime: Date.now() - state.config.apiList.startTime!,
          isLoading: false,
          isLoaded: true,
          error,
        },
      },
    };
  }),



  on(ServersActions.setGateList, (state, {response}) => ({
    ...state,
    activeElementData: {
      ...state.activeElementData,
      gateList: response
    }
  })),
  on(ServersActions.setActiveServer, (state, {ip, port}) => ({
    ...state,
    activeElementData: {
      ...state.activeElementData,
      serverData: {
        ...state.activeElementData.serverData,
        response: {
          ...state.activeElementData.serverData.response,
          ip,
          port
        }
      }
    }
  })),
  on(ServersActions.clearActiveElementData, (state,) => ({
    ...state,
    activeElementData: initialState.activeElementData
  })),
);

