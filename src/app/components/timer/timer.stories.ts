import {Meta, moduleMetadata, StoryObj} from '@storybook/angular';
import {Timer} from './timer';

const meta: Meta<Timer> = {
  component: Timer,
  decorators: [
    moduleMetadata({
      imports: [],
      declarations: [],
      providers: [],
    }),
    (story) => ({
      ...story(),
      template: `
        <div style="width: 300px; height: 500px; background-color: bisque">
          ${story().template}
        </div>
      `,
    }),
  ],
  args: {
  },
};
export default meta;
type Story = StoryObj<Timer>;

export const Base: Story = {};

export const BeforeEnd: Story = {
  args: {
    displayTime: '11:56',
    isPast: false
  },
};

export const AfterEnd: Story = {
  args: {
    displayTime: '13:34',
    isPast: true
  },
};
