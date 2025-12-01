import {createReducer, on} from '@ngrx/store';
import * as ServersActions from './servers.actions';
import {IConfig, IServerData, IActiveElementData} from '../../models/servers';
import {
  emptyAsyncResponse,
  emptyBotInfoResponse, emptyBotResultResponse,
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
    ruleList: emptyAsyncResponse([]),
    activeBot: {
      botInfo: emptyAsyncResponse(emptyBotInfoResponse),
      botResultList: emptyAsyncResponse(emptyBotResultResponse),
      botErrorList: emptyAsyncResponse([])
    }
  }
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
      },
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
            response: response || botResultList.response ,
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

  on(ServersActions.loadBotInfo, (state) => {
    const botInfo = state.activeElementData.activeBot.botInfo;

    return {
      ...state,
      activeElementData: {
        ...state.activeElementData,
        activeBot: {
          ...state.activeElementData.activeBot,
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
  on(ServersActions.loadBotInfoSuccess, (state, { response }) => {
    const botInfo = state.activeElementData.activeBot.botInfo;

    return {
      ...state,
      activeElementData: {
        ...state.activeElementData,
        activeBot: {
          ...state.activeElementData.activeBot,
          botInfo: {
            ...botInfo,
            loadingTime: Date.now() - botInfo.startTime!,
            isLoading: false,
            isLoaded: true,
            response: response || botInfo.response ,
          },
        },
      },
    };
  }),
  on(ServersActions.loadBotInfoFailure, (state, { error }) => {
    const botInfo = state.activeElementData.activeBot.botInfo;
    return {
      ...state,
      activeElementData: {
        ...state.activeElementData,
        activeBot: {
          ...state.activeElementData.activeBot,
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

  on(ServersActions.getRulesList, (state) => {
    return {
      ...state,
      activeElementData: {
        ...state.activeElementData,
        ruleList: {
          ...state.activeElementData.ruleList,
          startTime: Date.now(),
          isLoading: true,
          isLoaded: false,
        },
      },
    };
  }),
  on(ServersActions.getRulesListSuccess, (state, { response }) => {
    return {
      ...state,
      activeElementData: {
        ...state.activeElementData,
        ruleList: {
          ...state.activeElementData.ruleList,
          loadingTime: Date.now() - state.config.apiList.startTime!,
          isLoading: false,
          isLoaded: true,
          response,
        },
      },
    };
  }),
  on(ServersActions.getRulesListFailure, (state, { error }) => {
    return {
      ...state,
      activeElementData: {
        ...state.activeElementData,
        ruleList: {
          ...state.activeElementData.ruleList,
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

  on(ServersActions.setIsStartedBotSuccess, (state, { response }) => {
    const botInfo = state.activeElementData.activeBot.botInfo;
    const botResultList = state.activeElementData.activeBot.botResultList;
    return {
      ...state,
      activeElementData: {
        ...state.activeElementData,
        activeBot: {
          ...state.activeElementData.activeBot,
          botInfo: {
            ...botInfo,
            response: {
              ...botInfo.response,
              botParams: {
                ...botInfo.response.botParams,
                paused: response.paused
              }
            },
          },
          botResultList: {
            ...botResultList,
            response: {
              ...botResultList.response,
              status: response.status,
            }
          },
        },
      },
    };
  }),

  on(ServersActions.setBotSettingsSuccess, (state, { response }) => {
    const botInfo = state.activeElementData.activeBot.botInfo;
    return {
      ...state,
      activeElementData: {
        ...state.activeElementData,
        activeBot: {
          ...state.activeElementData.activeBot,
          botInfo: {
            ...botInfo,
            response,
          },
        },
      },
    };
  }),

);

