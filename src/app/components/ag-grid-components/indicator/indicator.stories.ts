import {Meta, moduleMetadata, StoryObj} from '@storybook/angular';
import {Indicator} from './indicator';

const meta: Meta<Indicator> = {
  component: Indicator,
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
type Story = StoryObj<Indicator>;

export const Base: Story = {};

export const Active: Story = {
  args: {
    status: 'active',
  },
};

export const Error: Story = {
  args: {
    status: 'error',
  },
};

export const Pending: Story = {
  args: {
    status: 'pending',
  },
};

export const Close: Story = {
  args: {
    status: 'close',
  },
};
