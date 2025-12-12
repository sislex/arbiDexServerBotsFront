import {IndicatorContainer} from '../../containers/indicator-container/indicator-container';
import {PauseBotContainer} from '../../containers/pause-bot-container/pause-bot-container';
import {RestartBotContainer} from '../../containers/restart-bot-container/restart-bot-container';
import {ActionsContainer} from '../../containers/actions-container/actions-container';

export const botDataListStabs_1 = [
  {
    parameter: 'parameter_1',
    value: 'value_1',
  },
]

export const botsControlColDefs = [
  {
    field: "id",
    headerName: 'ID',
    width: 100,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 100,
    cellRenderer: IndicatorContainer,
    cellRendererParams: {
      colorMapping: {
        'active': 'green',
        '': 'red',
        'finished': 'gray',
        'pause': 'yellow',
      }
    },
    cellStyle: { textAlign: 'center', justifyContent: 'center', alignItems: 'center' },
    headerClass: 'align-center little-width',
  },
  {
    field: "paused",
    headerName: 'Start/Pause',
    flex: 1,
    cellRenderer: PauseBotContainer,
    // cellRendererParams: {
    //   onAction: this.onAction.bind(this),
    // },
  },
  {
    headerName: 'Restart',
    flex: 1,
    cellRenderer: RestartBotContainer,
    // cellRendererParams: {
    //   onAction: this.onAction.bind(this),
    // },
  },
  {
    headerName: 'Edit',
    width: 125,
    cellRenderer: ActionsContainer,
    // cellRendererParams: {
    //   onAction: this.onAction.bind(this),
    // },
  },
];

export const botsControlDefaultColDef = {
  sortable: false,
  cellStyle: { textAlign: 'center', border: '1px solid #e0e0e0' },
  headerClass: 'align-center',
  suppressMovable: true,
  autoHeight: true,
};
