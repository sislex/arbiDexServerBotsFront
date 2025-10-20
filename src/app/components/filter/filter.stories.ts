import {Meta, moduleMetadata, StoryObj} from '@storybook/angular';
import {Filter} from './filter';

const meta: Meta<Filter> = {
  component: Filter,
  decorators: [
    moduleMetadata({
      imports: [],
      declarations: [],
      providers: [],
    }),
  ],
  args: {
    // FilterTitle: 'FilterTitle',
  },
};
export default meta;
type Story = StoryObj<Filter>;

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
