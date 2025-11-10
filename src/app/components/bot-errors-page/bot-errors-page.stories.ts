import {Meta, moduleMetadata, StoryObj} from '@storybook/angular';
import {fn} from 'storybook/test';
import {BotErrorsPage} from './bot-errors-page';

const meta: Meta<BotErrorsPage> = {
  component: BotErrorsPage,
  decorators: [
    moduleMetadata({
      imports: [],
      declarations: [],
      providers: [],
    }),
    (story) => ({
      ...story(),
      template: `
        <div style="width: 900px; height: 500px; background-color: bisque">
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
type Story = StoryObj<BotErrorsPage>;

export const Base: Story = {};

// export const Primary: Story = {
//   args: {
//     title: 'Standard title',
//     message: 'This is a standard message for confirmation pop up',
//     buttons: ['yes', 'no'],
//   },
// };
//
// export const WithoutButtons: Story = {
//   args: {
//     title: 'Standard title',
//     message: 'This is a standard message for confirmation pop up Without Buttons',
//   },
// };
