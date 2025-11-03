import {Meta, moduleMetadata, StoryObj} from '@storybook/angular';
import {AgGridActionList} from './ag-grid-action-list';
import {actionListStabs_1, actionListStabs_2, actionListStabs_3} from './stabs';

const meta: Meta<AgGridActionList> = {
  component: AgGridActionList,
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
type Story = StoryObj<AgGridActionList>;

export const Base: Story = {};

export const OneServer: Story = {
  args: {
    rowData: actionListStabs_1
  },
};

export const ServersList: Story = {
  args: {
    rowData: actionListStabs_2,
  },
};

export const BigDataServersList: Story = {
  args: {
    rowData: actionListStabs_3,
  },
};
