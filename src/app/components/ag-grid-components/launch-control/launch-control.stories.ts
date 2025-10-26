import {Meta, moduleMetadata, StoryObj} from '@storybook/angular';
import {LaunchControl} from './launch-control';

const meta: Meta<LaunchControl> = {
  component: LaunchControl,
  decorators: [
    moduleMetadata({
      imports: [],
      declarations: [],
      providers: [],
    }),
    (story) => ({
      ...story(),
      template: `
        <div class="ag-grid-container" style="width: 300px; height: 500px; background-color: bisque">
          ${story().template}
        </div>
      `,
    }),
  ],
  args: {
  },
};
export default meta;
type Story = StoryObj<LaunchControl>;

export const Base: Story = {};

// export const Active: Story = {
//   args: {
//     status: 'active',
//   },
// };
