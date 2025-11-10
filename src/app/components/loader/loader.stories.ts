import {Meta, moduleMetadata, StoryObj} from '@storybook/angular';
import {Loader} from './loader.component';

const meta: Meta<Loader> = {
  component: Loader,
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
  },
};
export default meta;
type Story = StoryObj<Loader>;

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
