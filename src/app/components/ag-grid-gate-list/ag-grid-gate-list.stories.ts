import {Meta, moduleMetadata, StoryObj} from '@storybook/angular';
import {AgGridGateList} from './ag-grid-gate-list';
import { AgGridAngular } from 'ag-grid-angular';
import {gateListStabs_2, gateListStabs_3, gateListStabs_4} from '../+stabs/gate-list-stabs';

const meta: Meta<AgGridGateList> = {
  component: AgGridGateList,
  decorators: [
    moduleMetadata({
      imports: [AgGridAngular],
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
type Story = StoryObj<AgGridGateList>;

export const Base: Story = {};

export const RandomData: Story = {
  args: {
    rowData: gateListStabs_2
  },
};

export const OneGate: Story = {
  args: {
    rowData: gateListStabs_3
  },
};

export const OneGateToOneBot: Story = {
  args: {
    rowData: gateListStabs_4
  },
};
