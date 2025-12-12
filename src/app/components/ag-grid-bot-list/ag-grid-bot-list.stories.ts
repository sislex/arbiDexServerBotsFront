import {Meta, moduleMetadata, StoryObj} from '@storybook/angular';
import {AgGridBotList} from './ag-grid-bot-list';
import {botListStabs_1, botListStabs_2, botListStabs_3} from '../+stabs/bot-list-stabs';

const meta: Meta<AgGridBotList> = {
  component: AgGridBotList,
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
type Story = StoryObj<AgGridBotList>;

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
