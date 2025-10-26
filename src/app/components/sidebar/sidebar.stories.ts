import {Meta, moduleMetadata, StoryObj} from '@storybook/angular';
import {Sidebar} from './sidebar';
import {fn} from 'storybook/test';

const meta: Meta<Sidebar> = {
  component: Sidebar,
  decorators: [
    moduleMetadata({
      imports: [],
      declarations: [],
      providers: [],
    }),
  ],
  args: {
    emitter: fn(),
    sidebarTitle: 'sidebarTitle',
  },
};
export default meta;
type Story = StoryObj<Sidebar>;

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
  },
};
