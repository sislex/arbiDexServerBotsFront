import {Meta, moduleMetadata, StoryObj} from '@storybook/angular';
import {AgGridAngular} from 'ag-grid-angular';
import {AgGridBotsList} from './ag-grid-bots-list';
import {botListStabs_1, botListStabs_2, botListStabs_3} from './stabs';

const meta: Meta<AgGridBotsList> = {
  component: AgGridBotsList,
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
type Story = StoryObj<AgGridBotsList>;

export const Base: Story = {};

export const OneServer: Story = {
  args: {
    rowData: botListStabs_1
  },
};

export const ServersList: Story = {
  args: {
    rowData: botListStabs_2,
  },
};

export const BigDataServersList: Story = {
  args: {
    rowData: botListStabs_3,
  },
};
