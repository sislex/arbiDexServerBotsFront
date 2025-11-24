import { API } from './api';

// export interface IBotData {
//   id: string;
//   name: string;
//   type: any;
//   description: string;
//   gate: any;
//   maxTimeRequest: number;
//   timeRequest: number;
//   status: string;
//   sendData: boolean;
//   isStarted: boolean;
//
//   botJSON: string;
//   actionJSON: string;
//   actionTypeSelect: string;
//   botTypeSelect: string;
// }


interface IJobParams {
  jobType: string;
  i: number;
}

interface IBotParams {
  botType: string;
  delayBetweenRepeat: number;
  isRepeat: boolean;
  maxJobs: number;
  paused: boolean;
}

interface IBotRule {
  jobParams: IJobParams;
  botParams: IBotParams;
  id: string;
}

export interface IServerAuthData {
  login: string;
  password: string;
}

export interface IServerData {
  ip: string;
  port: string;
  version: string;
  status: string;
  timestampFinish: string;
  timestampStart: string;
  botsCount: number;
}

export interface IServerDataAPI extends API {
  response: IServerData;
}

export interface IBotRuleAPI extends API {
  response: IBotRule;
}

export interface IResultAPI extends API {
  response: IResult[];
}

export interface IBotErrorAPI extends API {
  response: IBotError[];
}

export interface ITypesListAPI extends API {
  response: ITypesList[];
}

export interface IServer {
  ip: string;
  port?: string;
  name: string;
}

export interface IApiList {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  description: string;
  tags: string[];
  version: string;
}

export interface IApiListAPI extends API {
  response: IApiList[]
}

export interface IConfig {
  serverList: IServer[];
  apiList: IApiListAPI;
}

export interface ITypesList {
  id: string;
  label: string;
  type: string;
  description: string;
}

export interface IGateItem {
  ip: string;
  name: string;
}

export interface ILastJobResult {
  ok: boolean;
  amountOut: string;
}

export interface IBotError {
  id: string;
  time: string;
  status: string;
  message: string;
}

export interface IBotControlAPI extends API {
  response: IBotControl;
}

export interface IBotListControlAPI extends API {
  response: IBotControl[];
}

// export interface IBotControl {
//   id: string;
//   running: boolean;
//   createdAt: string;
//   jobCount: number;
//   errorCount: number;
//   lastJobTimeStart: string;
//   lastJobTimeFinish: string;
//   lastLatency: number;
//   lastJobResult: ILastJobResult;
// }

interface QuoteExactInputSingle {
  amountOut: string;
  sqrtPriceX96After: string;
  initializedTicksCrossed: string;
  gasEstimate: string;
}

interface QuoteExactOutputSingle {
  amountIn: string;
  sqrtPriceX96After: string;
  initializedTicksCrossed: string;
  gasEstimate: string;
}

interface QuoteResult {
  quoteExactInputSingle: QuoteExactInputSingle;
  quoteExactOutputSingle: QuoteExactOutputSingle;
}

interface LastJobResult {
  ok: boolean;
  latencyMs: number;
  result: QuoteResult;
  blockNumber: number;
}

interface IBotControl {
  status: string;
  id: string;
  running: boolean;
  createdAt: string;
  jobCount: number;
  errorCount: number;
  lastJobTimeStart: string;
  lastJobTimeFinish: string;
  lastLatency: number;
  lastJobResult: LastJobResult;
}

export interface IActiveBot {
  botInfo: IBotControlAPI; //IBotRuleAPI;
  botResultList: IResultAPI;
  botErrorList: IBotErrorAPI;
}

export interface IResult {
  value: string;
  parameter: any;
}

export interface IActiveElementData {
  serverData: IServerDataAPI;
  botTypesList: ITypesListAPI;
  jobTypesList: ITypesListAPI;
  gateList: IGateItem[];
  botControlList: IBotListControlAPI;
  activeBot: IActiveBot;
}
