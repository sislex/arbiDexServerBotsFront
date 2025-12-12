import {Meta, moduleMetadata, StoryObj} from '@storybook/angular';
import {AgGrid} from './ag-grid';
import {
  actionListColDefs,
  actionListDefaultColDef,
  actionListStabs_1,
  actionListStabs_2,
  actionListStabs_3,
} from '../+stabs/action-stabs';
import {apiListColDefs, apiListDefaultColDef, apiListStabs_1} from '../+stabs/api-list-stabs';
import {botsControlStabs_1} from '../+stabs/bots-control-stabs';
import {botsControlColDefs, botsControlDefaultColDef} from '../+stabs/bot-control-panel-stabs';

const meta: Meta<AgGrid> = {
  component: AgGrid,
  decorators: [
    moduleMetadata({
      imports: [],
      declarations: [],
      providers: [],
    }),
    (story) => ({
      ...story(),
      template: `
        <div class="ag-grid-container" style="width: 100%; height: 500px;">
          ${story().template}
        </div>
      `,
    }),
  ],
  args: {

  },


};
export default meta;
type Story = StoryObj<AgGrid>;

export const Empty: Story = {};

export const ActionListOneEntry: Story = {
  args: {
    rowData: actionListStabs_1,
    colDefs: actionListColDefs,
    defaultColDef: actionListDefaultColDef
  },
};
export const ActionListBasic: Story = {
  args: {
    rowData: actionListStabs_2,
    colDefs: actionListColDefs,
    defaultColDef: actionListDefaultColDef
  },
};
export const ActionListBigDataServersList: Story = {
  args: {
    rowData: actionListStabs_3,
    colDefs: actionListColDefs,
    defaultColDef: actionListDefaultColDef
  },
};

export const ApiListOneEntry: Story = {
  args: {
    rowData: apiListStabs_1,
    colDefs: apiListColDefs,
    defaultColDef: apiListDefaultColDef
  },
};

// export const ArbitrageListOneEntry: Story = {
//   args: {
//     rowData: arbitrageListStabs_1,
//     colDefs: arbitrageListColDefs,
//     defaultColDef: arbitrageListDefaultColDef
//   },
// };

export const botsControlOneEntry: Story = {
  args: {
    rowData: botsControlStabs_1,
    colDefs: botsControlColDefs,
    defaultColDef: botsControlDefaultColDef,

  },
};
