import {Meta, moduleMetadata, StoryObj} from '@storybook/angular';
import {AgGrid} from './ag-grid';
import {AgGridAngular} from 'ag-grid-angular';

const meta: Meta<AgGrid> = {
  component: AgGrid,
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
    // AgGridTitle: 'AgGridTitle',
  },

};
export default meta;
type Story = StoryObj<AgGrid>;

export const Base: Story = {};

export const WithCustomProvider: Story = {
  decorators: [
    moduleMetadata({
      imports: [],
      declarations: [],
      providers: [
      ],
    }),
  ],
  args: {
    // header: '33',
  },
};
