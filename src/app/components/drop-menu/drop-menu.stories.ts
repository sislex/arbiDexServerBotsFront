import {Meta, moduleMetadata, StoryObj} from '@storybook/angular';
import {DropMenu} from './drop-menu';
import {fn} from 'storybook/test';
import {dropMenuStabs_1, dropMenuStabs_2} from './stabs';

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

export const OneElement: Story = {
  args: {
    menuData: dropMenuStabs_1
  },
};

export const ManyElements: Story = {
  args: {
    menuData: dropMenuStabs_2
  },
};
