import {Toolbar} from './toolbar';
import {Meta, moduleMetadata, StoryObj} from '@storybook/angular';

const meta: Meta<Toolbar> = {
  component: Toolbar,
  decorators: [
    moduleMetadata({
      imports: [],
      declarations: [],
      providers: [],
    }),
  ],
  args: {
    header: 'Header',
  },
};
export default meta;
type Story = StoryObj<Toolbar>;

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
    header: '33',
  },
};
