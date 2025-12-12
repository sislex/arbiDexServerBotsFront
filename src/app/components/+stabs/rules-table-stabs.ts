import {ColDef, ICellRendererParams} from 'ag-grid-community';

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


export const rulesTableColDefs: ColDef[] = [
  {
    headerName: '#',
    width: 50,
    valueGetter: params => {
      if (!params.node || params.node.rowIndex == null) return '';
      return params.node.rowIndex + 1;
    },
  },
  {
    field: "id",
    headerName: 'ID',
    width: 150,
  },
  {
    field: "botParams",
    headerName: 'Bot Rule',
    flex: 1,
    cellStyle: { textAlign: 'left'},
    wrapText: true,
    autoHeight: true,
    valueFormatter: p => JSON.stringify(p.value, null, 2),

    cellRenderer: (params: ICellRendererParams) => {
      const pre = document.createElement("pre");
      pre.style.margin = "0";
      pre.style.whiteSpace = "pre-wrap";
      pre.textContent = params.valueFormatted ?? params.value;
      return pre;
    },
  },
  {
    field: "jobParams",
    headerName: 'Job Rule',
    flex: 1,
    cellStyle: { textAlign: 'left'},
    wrapText: true,
    autoHeight: true,
    valueFormatter: p => JSON.stringify(p.value, null, 2),

    cellRenderer: (params: ICellRendererParams) => {
      const pre = document.createElement("pre");
      pre.style.margin = "0";
      pre.style.whiteSpace = "pre-wrap";
      pre.textContent = params.valueFormatted ?? params.value;
      return pre;
    },
  }
];

export const rulesTableDefaultColDef: ColDef = {
  sortable: false,
  cellStyle: { textAlign: 'center', border: '1px solid #e0e0e0' },
  headerClass: 'align-center',
  suppressMovable: true,
};

