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
  },
};
export default meta;
type Story = StoryObj<Tabs>;


export const TabsEx: Story = {
  args: {
    list: ['Tab_1', 'Tab_2', 'Tab_3', 'Tab_4', ]
  },
};


export const ActiveTab_3: Story = {
  args: {
    list: ['Tab_1', 'Tab_2', 'Tab_3', 'Tab_4', ],
    tabName: 'Tab_3'
  },
};
