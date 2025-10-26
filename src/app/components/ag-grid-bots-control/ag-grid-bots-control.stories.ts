import {Meta, moduleMetadata, StoryObj} from '@storybook/angular';
import {AgGridBotsControl} from './ag-grid-bots-control';

const meta: Meta<AgGridBotsControl> = {
  component: AgGridBotsControl,
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
type Story = StoryObj<AgGridBotsControl>;

export const Base: Story = {};

export const OneRow: Story = {
  args: {
    // rowData: gridStabs_1
  },
};
