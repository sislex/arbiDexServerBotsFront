import {Meta, moduleMetadata, StoryObj} from '@storybook/angular';
import {Tabs} from './tabs';

const meta: Meta<Tabs> = {
  component: Tabs,
  decorators: [
    moduleMetadata({
      imports: [],
      declarations: [],
      providers: [],
    }),
  ],
  args: {
    // TabsTitle: 'TabsTitle',
  },
};
export default meta;
type Story = StoryObj<Tabs>;

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
