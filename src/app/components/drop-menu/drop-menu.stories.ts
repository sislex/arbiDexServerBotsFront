import {Meta, moduleMetadata, StoryObj} from '@storybook/angular';
import {DropMenu} from './drop-menu';

const meta: Meta<DropMenu> = {
  component: DropMenu,
  decorators: [
    moduleMetadata({
      imports: [],
      declarations: [],
      providers: [],
    }),
  ],
  args: {
    // DropMenuTitle: 'DropMenuTitle',
  },
};
export default meta;
type Story = StoryObj<DropMenu>;

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
