
// export interface IBotData {
//Статусы для каждого бота:
//действующий
//остановлен по предназначению (Остановлен или закончил или остановили принудительно)
//остановлен из-за ошибки
//статус ожидает ответ от сервера
//статус пауза
//Статус выполнения
// сколько всего ошибок с момента запуска и какие они были
// поиск ошибки от и до заданных
// path: 'server/:ip/tab/:tabId',
//actions для бота
//пауза/продолжить
//остановка/запуск
//перезапуск
//изменение настроек бота
//получить настройки бота
// }



//Страницы/таблицы:
// 1) Отображение серверной информации
// 2) Отображение информации о гейтах
//GET:
// gateList: string[];
// botsResponse: IBotResponse[];
// 3) Отображение панели управления ботами
// 4) Отображение информации о типах ботов
//GET:
// ITypesList {
//   label: string;
//   type: string;
//   description: string;
// }
// 5) Отображение информации об экшенах ботов
//GET:
// ITypesList {
//   label: string;
//   type: string;
//   description: string;
// }
// 6) Форма изменения Бота
//POST:
// 7) Форма добавления Бота
// 8) Функция удаления бота

// IBotResponse {
//   id: string;
//   name: string;
//   gate: string;
//   maxRequests: number;
//   requests: number;
//   errors: IError[]
// }

// export interface ITestBot<Params, Result> {
//   createdAt: Date;
//   actionCount: number;
//   errorCount: number;
//   errorMessages: string[];
//
//   lastActionTimeStart: Date;
//   lastActionTimeFinish: Date;
//   lastLatency: number;
//   lastActionResult: number;
//
//   running: boolean;
//
//
//   action(): Promise<Result>;
// }


// API по страницам 03.11
//
// Данные о сервере (ВЫВОД 3-х таблиц) serverDataAPI: IServer;

const serverDataAPI: IServer | {} = {};

interface IType {
  name: string;
  type: string;
  description: string;
}

interface IAuthData {
  login: string;
  pass: string;
}
interface IServer {
  ip: string; //добавляем на фронте
  port: string; //добавляем на фронте
  authData: IAuthData; //добавляем на фронте

  version: string;
  botsCount: number;
  timestampFinish: Date; //дата окончания работы
  timestampStart: Date; //дата начала работы сервера
  actionTypeList: IType[];
  botTypeList: IType[];
}

// Делим на API

// данные с сервера о сервере
// version //botsCount, timestampStart // actionTypeList // botTypeList

//данные извне о сервере
//timestampFinish //authData
// -----------------------------------------------------------------------------------------------------------------------

// Данные о гейтах gatesDataAPI: IGate[];

const gatesDataAPI: IGate[] | [] = [];
interface IBotGatesData {
  id: string;
  name: string;
  requestsCount: number;
  errorsCount: number;
}

interface IGateSetting {

}

interface IGate {
  ip: string;
  name: string;
  settings: IGateSetting;
  botGatesData: IBotGatesData[];
}

// Делим на API

// данные с сервера о гейтах
// ip, name

//данные с сервера о ботах (отправляем гейт и находим по соотвветствию
//id, name (единые всегда) //requestsCount //errorsCount (всегда разные)

// -----------------------------------------------------------------------------------------------------------------------

// Данные о управлении ботами botListDataAPI: IBotData[];

const botListDataAPI: IBotData[] | [] = [];

interface IBotData {
  id: string;
  name: string;
  gateIp: string[];
  gateName: string;
  maxTimeRequest: number;
  timeRequest: number;
  status: string;
  sendData: boolean;
  isStarted: boolean;
}


// Делим на API

// данные с сервера о ботах - константы
// id, name, gateIp, gateName, maxTimeRequest
// изменяемые - //timeRequest //status //sendData //isStarted

// -----------------------------------------------------------------------------------------------------------------------





//надиктовка
//Сервер -> информация:
// version, actionTypeList, botTypeList, timestampStart,


//категории API









// ФИНАЛЬНО:
//   Общие интерфейсы:
//   interface IServer {
//     ip: string;
//     port: string;
//     authData: IAuthData;
//     version: string;
//     botsCount: number;
//     timestampStart: Date;
//     timestampFinish: Date;
//     actionTypeList: IType[];
//     botTypeList: IType[];
//   }
//
// 1)
//   /server/info
// Ответ: {
//   "version": "1.0.5",
//     "botsCount": 42,
//     "timestampStart": "2025-11-03T10:00:00Z"
// }
//
// 2)
//   /server/actionTypes
// Ответ: {
//   "actionTypeList"
// :
//   [
//     {"name": "SendMessage", "type": "action", "description": "Отправка сообщения"}
//   ],
// },
// 2.1)
// /server/botTypes
// Ответ: {
//
//     "botTypeList": [
//     { "name": "TelegramBot", "type": "bot", "description": "Работа с Telegram API" }
//   ]
// }

// -----------------------------------------------------------------------------------------------------------------------
//   Общие интерфейсы:
//   interface IGate {
//     ip: string;
//     name: string;
//     settings: IGateSetting;
//     botGatesData: IBotGatesData[];
//   }
//
// interface IBotGatesData {
//   id: string;
//   name: string;
//   requestsCount: number;
//   errorsCount: number;
// }
//
//
// 3)
//   /gates/list
// Ответ: [
//   {
//     "ip": "192.168.0.2",
//     "name": "MainGate"
//   }
// ]
//
//
// 4)
//   /gates/bots
// Ответ: [
//   {
//     "id": "bot-1",
//     "name": "BotAlpha",
//     "requestsCount": 1520,
//     "errorsCount": 12
//   }
// ]
//
// -----------------------------------------------------------------------------------------------------------------------
//
//   Общие интерфейсы:
//   interface IBotData {
//     id: string;
//     name: string;
//     gateIp: string[];
//     gateName: string[];
//     maxTimeRequest: number;
//     timeRequest: number;
//     status: string;
//     sendData: boolean;
//     isStarted: boolean;
//   }
//
// 5)
//   /bots/list
// Ответ:[
//   {
//     "id": "bot-1",
//     "name": "BotAlpha",
//     "gateIp": ["192.168.0.2"],
//     "gateName": ["MainGate"],
//     "maxTimeRequest": 5000
//   }
// ]
//
// 6)
//   /bots/status
// Ответ:
//   [
//     {
//       "timeRequest": 2400,
//       "status": "active",
//       "sendData": true,
//       "isStarted": true
//     }
//   ]

// 7)
//   POST: /bots
// Запрос:{
//   "botType": "type1",
//     "actionType": "type3",
//     "botConfigJSON": {
//       ?
//     },
//     "actionConfigJSON": {
//       ?
//     }
// }
//
// Ответ:{
//   "id": "bot-001",
//     "name": "BotAlpha",
//     "botType": "type1",
//     "actionType": "type3",
//   "status": "active"
// }

// 8)
//   PUT: /bots
// Запрос:{
//    "id": "idBot"
//    "name": "name"
//   "botType": "type1",
//     "actionType": "type3",
//     "botConfigJSON": {
//     ?
//   },
//   "actionConfigJSON": {
//     ?
//   }
// }
//
// Ответ:{
//   "id": "bot-idBot",
//     "name": "name",
//     "botType": "type1",
//     "actionType": "type3",
//   "status": "active"
// }

// 9)
//   POST: /bots/delete
// Запрос: {
//   "id": "bot-001"
// }
//
// Ответ: { "status": "deleted", "id": "bot-001" }




