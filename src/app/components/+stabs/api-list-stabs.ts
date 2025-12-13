import type {ColDef} from 'ag-grid-community';

export const apiListStabs_1 = [
  {
    type: 'GET',
    endpoint: '...get/endpoint/api',
    description: 'This is the API description where the request parameters are described.'
  },
  {
    type: 'POST',
    endpoint: '...post/endpoint/api',
    description: 'This is the API description where the request parameters are described.'
  },
  {
    type: 'PUT',
    endpoint: '...put/endpoint/api',
    description: 'This is the API description where the request parameters are described.'
  },
  {
    type: 'DELETE',
    endpoint: '...delete/endpoint/api',
    description: 'This is the API description where the request parameters are described.'
  },
]



export const apiListColDefs: ColDef[] = [
  {
    field: "#",
    headerName: '#',
    width: 50,
    valueGetter: params => {
      if (!params.node || params.node.rowIndex == null) return '';
      return params.node.rowIndex + 1;
    },
  },
  {
    field: "method",
    headerName: 'Type',
    flex: 1,
    cellStyle: { textAlign: 'left' },
    cellClass: 'selectable-text',
  },
  {
    field: "path",
    headerName: 'Address API',
    flex: 1,
    cellStyle: { textAlign: 'left' },
    cellClass: 'selectable-text',
  },
  {
    field: "description",
    headerName: 'Description',
    flex: 3,
    cellStyle: { textAlign: 'left'},
    autoHeight: true,
    wrapText: true,
    cellClass: 'selectable-text',
  },
];

export const apiListDefaultColDef: ColDef = {
  sortable: false,
  cellStyle: { textAlign: 'center', border: '1px solid #e0e0e0' },
  headerClass: 'align-center',
  suppressMovable: true,
};
