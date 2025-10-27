import {Meta, moduleMetadata, StoryObj} from '@storybook/angular';
import {DropMenu} from './drop-menu';
import {fn} from 'storybook/test';

const meta: Meta<DropMenu> = {
  component: DropMenu,
  decorators: [
    moduleMetadata({
      imports: [],
      declarations: [],
      providers: [],
    }),
    (story) => ({
      ...story(),
      template: `
        <div style="width: 100%; height: 500px; background-color: bisque">
          ${story().template}
        </div>
      `,
    }),
  ],
  args: {
    emitter: fn(),
  },
};
export default meta;
type Story = StoryObj<DropMenu>;

export const Base: Story = {};

export const WithCustomProvider: Story = {
  args: {
    menuData: {
      title: 'type',
      list: [
        {
          label: '1type',
        },
        {
          label: '2type',
        },
      ]
    }
  },
};
