import {Meta, moduleMetadata, StoryObj} from '@storybook/angular';
import {AgGridServerData} from './ag-grid-server-data';
import {serverStabs_1, serverStabs_2, serverStabs_3} from './stabs';

const meta: Meta<AgGridServerData> = {
  component: AgGridServerData,
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
type Story = StoryObj<AgGridServerData>;

export const Base: Story = {};

export const OneServer: Story = {
  args: {
    rowData: serverStabs_1
  },
};

export const ServersList: Story = {
  args: {
    rowData: serverStabs_2,
  },
};

export const BigDataServersList: Story = {
  args: {
    rowData: serverStabs_3,
  },
};
