import {createReducer, on} from '@ngrx/store';
import * as ServersActions from './servers.actions';
import {IConfig, IServerData, IActiveElementData} from '../../models/servers';
import {ApiListConfig, serverListConfig} from './configs';

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
  featureName: 'server manager', //Временно до внедрения в основное приложение.
  config: {
    serverList: serverListConfig,
    apiList: ApiListConfig
  },
  serverListResponse: [],
  activeElementData: {
    serverData: {
      startTime: null,
      loadingTime: null,
      isLoading: false,
      isLoaded: false,
      response: {
        ip: '',
        port: '',
        version: '',
        status: 'active',
        timestampFinish: '',
        timestampStart: '',
        botsCount: 0
      }
    },
    botTypesList: {
      startTime: null,
      loadingTime: null,
      isLoading: false,
      isLoaded: false,
      response: []
    },
    actionTypesList: {
      startTime: null,
      loadingTime: null,
      isLoading: false,
      isLoaded: false,
      response: []
    },
    gateList: [],
    botControlList: {
      startTime: null,
      loadingTime: null,
      isLoading: false,
      isLoaded: false,
      response: [],
    },

    activeBot: {
      startTime: null,
      loadingTime: null,
      isLoading: false,
      isLoaded: false,
      response: {
        botInfo: {
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
        },
        botResultList: [],
        botErrorList: [],
      },
    },
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

  on(ServersActions.loadActionTypesList, (state) => ({
    ...state,
    activeElementData: {
      ...state.activeElementData,
      actionTypesList: {
        ...state.activeElementData.actionTypesList,
        startTime:  Date.now(),
        isLoading: true,
        isLoaded: false,
      }
    }
  })),
  on(ServersActions.loadActionTypesListSuccess, (state, {response}) => ({
    ...state,
    activeElementData: {
      ...state.activeElementData,
      actionTypesList: {
        ...state.activeElementData.actionTypesList,
        loadingTime: Date.now() - state.activeElementData.actionTypesList.startTime!,
        isLoading: false,
        isLoaded: true,
        response
      }
    }
  })),
  on(ServersActions.loadActionTypesListFailure, (state, {error}) => ({
    ...state,
    activeElementData: {
      ...state.activeElementData,
      actionTypesList: {
        ...state.activeElementData.actionTypesList,
        loadingTime: Date.now() - state.activeElementData.actionTypesList.startTime!,
        isLoading: false,
        isLoaded: true,
        error
      }
    }
  })),

  on(ServersActions.loadBotControlList, (state) => ({
    ...state,
    activeElementData: {
      ...state.activeElementData,
      botControlList: {
        ...state.activeElementData.botControlList,
        startTime:  Date.now(),
        isLoading: true,
        isLoaded: false,
      }
    }
  })),
  on(ServersActions.loadBotControlListSuccess, (state, {response}) => ({
    ...state,
    activeElementData: {
      ...state.activeElementData,
      botControlList: {
        ...state.activeElementData.botControlList,
        loadingTime: Date.now() - state.activeElementData.botControlList.startTime!,
        isLoading: false,
        isLoaded: true,
        response
      }
    }
  })),
  on(ServersActions.loadBotControlListFailure, (state, {error}) => ({
    ...state,
    activeElementData: {
      ...state.activeElementData,
      botControlList: {
        ...state.activeElementData.botControlList,
        loadingTime: Date.now() - state.activeElementData.botControlList.startTime!,
        isLoading: false,
        isLoaded: true,
        error
      }
    }
  })),
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

