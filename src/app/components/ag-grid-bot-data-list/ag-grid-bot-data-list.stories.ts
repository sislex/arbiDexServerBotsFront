import {Meta, moduleMetadata, StoryObj} from '@storybook/angular';
import {AgGridBotDataList} from './ag-grid-bot-data-list';
import {botDataListStabs_1} from '../+stabs/bot-data-list-stabs';

const meta: Meta<AgGridBotDataList> = {
  component: AgGridBotDataList,
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
type Story = StoryObj<AgGridBotDataList>;

export const Base: Story = {};

export const OneParameter: Story = {
  args: {
    rowData: botDataListStabs_1
  },
};
//
// export const ServersList: Story = {
//   args: {
//     rowData: botListStabs_2,
//   },
// };
//
// export const BigDataServersList: Story = {
//   args: {
//     rowData: botListStabs_3,
//   },
// };
