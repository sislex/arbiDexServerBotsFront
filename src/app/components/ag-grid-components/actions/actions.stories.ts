import {Meta, moduleMetadata, StoryObj} from '@storybook/angular';
import {Actions} from './actions';
import {fn} from 'storybook/test';

const meta: Meta<Actions> = {
  component: Actions,
  decorators: [
    moduleMetadata({
      imports: [],
      declarations: [],
      providers: [],
    }),
    (story) => ({
      ...story(),
      template: `
        <div class="custom-icon-button" style="width: 300px; height: 500px; background-color: bisque">
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
type Story = StoryObj<Actions>;

export const Base: Story = {};

export const Active: Story = {
  args: {
    data: {
      name: 'Test Item',
      id: '1',
    },
  },
};
