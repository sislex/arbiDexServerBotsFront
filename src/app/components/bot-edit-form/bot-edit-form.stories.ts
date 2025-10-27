import {Meta, moduleMetadata, StoryObj} from '@storybook/angular';
import {BotEditForm} from './bot-edit-form';

const meta: Meta<BotEditForm> = {
  component: BotEditForm,
  decorators: [
    moduleMetadata({
      imports: [],
      declarations: [],
      providers: [],
    }),
  ],
  args: {
  },
};
export default meta;
type Story = StoryObj<BotEditForm>;

export const Base: Story = {};

export const WithCustomProvider: Story = {
  args: {
  },
};
