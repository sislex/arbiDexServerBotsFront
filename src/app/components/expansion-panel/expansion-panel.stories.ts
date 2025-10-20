import {Meta, moduleMetadata, StoryObj} from '@storybook/angular';
import {ExpansionPanel} from './expansion-panel';

const meta: Meta<ExpansionPanel> = {
  component: ExpansionPanel,
  decorators: [
    moduleMetadata({
      imports: [],
      declarations: [],
      providers: [],
    }),
  ],
  args: {
    // ExpansionPanelTitle: 'ExpansionPanelTitle',
  },
};
export default meta;
type Story = StoryObj<ExpansionPanel>;

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
