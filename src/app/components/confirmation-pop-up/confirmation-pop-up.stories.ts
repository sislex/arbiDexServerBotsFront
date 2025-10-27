import {Meta, moduleMetadata, StoryObj} from '@storybook/angular';
import {fn} from 'storybook/test';
import {ConfirmationPopUp} from './confirmation-pop-up';

const meta: Meta<ConfirmationPopUp> = {
  component: ConfirmationPopUp,
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
    emitter: fn(),
  },
};
export default meta;
type Story = StoryObj<ConfirmationPopUp>;

export const Base: Story = {};

// export const Edit: Story = {
//   args: {
//     icon: 'edit',
//     type: 'default',
//   },
// };
