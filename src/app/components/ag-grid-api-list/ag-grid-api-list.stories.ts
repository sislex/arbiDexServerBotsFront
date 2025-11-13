import {Meta, moduleMetadata, StoryObj} from '@storybook/angular';
import {AgGridApiList} from './ag-grid-api-list';
import {apiListStabs_1} from './stabs';

const meta: Meta<AgGridApiList> = {
  component: AgGridApiList,
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
type Story = StoryObj<AgGridApiList>;

export const Base: Story = {};

export const OneServer: Story = {
  args: {
    rowData: apiListStabs_1
  },
};
