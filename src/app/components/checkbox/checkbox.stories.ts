import {Meta, moduleMetadata, StoryObj} from '@storybook/angular';
import {Checkbox} from './checkbox';

const meta: Meta<Checkbox> = {
  component: Checkbox,
  decorators: [
    moduleMetadata({
      imports: [],
      declarations: [],
      providers: [],
    }),
  ],
  args: {
    // CheckboxTitle: 'CheckboxTitle',
  },
};
export default meta;
type Story = StoryObj<Checkbox>;

export const Base: Story = {};

export const WithCustomProvider: Story = {
  decorators: [
    moduleMetadata({
      imports: [],
      declarations: [],
      providers: [
      ],
    }),
  ],
  args: {
    // header: '33',
  },
};
