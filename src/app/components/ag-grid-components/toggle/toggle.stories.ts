import {Meta, moduleMetadata, StoryObj} from '@storybook/angular';
import {Toggle} from './toggle';

const meta: Meta<Toggle> = {
  component: Toggle,
  decorators: [
    moduleMetadata({
      imports: [],
      declarations: [],
      providers: [],
    }),
    (story) => ({
      ...story(),
      template: `
        <div style="width: 200px; height: 200px; background-color: gray ">
          ${story().template}
        </div>
      `,
    }),
  ],
  argTypes: {
    isChecked: { control: 'boolean' },
    description: { control: 'text' },
  },

};
export default meta;
type Story = StoryObj<Toggle>;

export const Base: Story = {
  args: {
    description: 'Simple toggle',
    isChecked: false,
  },
  render: (args) => ({
    props: args,
    template: `<app-toggle class="custom-toggle" [description]="description" [(ngModel)]="isChecked"></app-toggle>`,
  }),
};

export const Checked: Story = {
  args: {
    description: 'Enabled toggle',
    isChecked: true,
  },
  render: (args) => ({
    props: args,
    template: `<app-toggle class="custom-toggle" [description]="description" [(ngModel)]="isChecked"></app-toggle>`,
  }),
};

export const Unchecked: Story = {
  args: {
    description: 'Disabled toggle',
    isChecked: false,
  },
  render: (args) => ({
    props: args,
    template: `<app-toggle class="custom-toggle" [description]="description" [(ngModel)]="isChecked"></app-toggle>`,
  }),
};
