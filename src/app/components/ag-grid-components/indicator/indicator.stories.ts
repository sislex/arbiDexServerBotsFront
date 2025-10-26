import {Meta, moduleMetadata, StoryObj} from '@storybook/angular';
import {AgGridAngular} from 'ag-grid-angular';
import {Indicator} from './indicator';

const meta: Meta<Indicator> = {
  component: Indicator,
  decorators: [
    moduleMetadata({
      imports: [AgGridAngular],
      declarations: [],
      providers: [],
    }),
    (story) => ({
      ...story(),
      template: `
        <div style="width: 200px; height: 200px; background-color: black ">
            <app-indicator [color]="color"></app-indicator>
            COMMENT: {{comment || 'cleared'}}
        </div>

      `,
    }),
  ],
  args: {
  },

};
export default meta;
type Story = StoryObj<Indicator>;

export const Base: Story = {};

export const Green: Story = {
  render: () => ({
    props: {
      color: 'green',
      comment: 'Green Indicator'
    },
  })
}

export const Orange: Story = {
  render: () => ({
    props: {
      color: 'orange',
      comment: 'Orange Indicator'
    },
  })
}

export const Red: Story = {
  render: () => ({
    props: {
      color: 'red',
      comment: 'Red Indicator'
    },
  })
}
