import {Meta, moduleMetadata, StoryObj} from '@storybook/angular';
import {NotFoundPage} from './not-found-page';

const meta: Meta<NotFoundPage> = {
  component: NotFoundPage,
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
type Story = StoryObj<NotFoundPage>;

export const Base: Story = {};
