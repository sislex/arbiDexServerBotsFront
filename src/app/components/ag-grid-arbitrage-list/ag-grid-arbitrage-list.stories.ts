import {Meta, moduleMetadata, StoryObj} from '@storybook/angular';
import {AgGridArbitrageList} from './ag-grid-arbitrage-list';


const meta: Meta<AgGridArbitrageList> = {
  component: AgGridArbitrageList,
  decorators: [
    moduleMetadata({
      imports: [],
      declarations: [],
      providers: [],
    }),
    (story) => ({
      ...story(),
      template: `
        <div style="width: 100%; height: 500px;">
          ${story().template}
        </div>
      `,
    }),
  ],
  args: {
  },

};
export default meta;
type Story = StoryObj<AgGridArbitrageList>;

export const Base: Story = {};

// export const oneError: Story = {
//   args: {
//     rowData: errorListStabs_1
//   },
// };
//
// export const fiveErrors: Story = {
//   args: {
//     rowData: errorListStabs_2,
//   },
// };
//
// export const BigDataErrors: Story = {
//   args: {
//     rowData: errorListStabs_3,
//   },
// };
