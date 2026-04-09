import {API} from './api';

export interface IMenuData {
  title: string;
  list: {
    label: string;
  }[];
}

export interface IServersAPI extends API {
  response: IServers[];
}
export interface IServers {
  serverId: number;
  ip: string;
  port: string;
  serverName: string;
}
