import {Meta, moduleMetadata, StoryObj} from '@storybook/angular';
import {AgGridAngular} from 'ag-grid-angular';
import {LaunchControl} from './launch-control';

const meta: Meta<LaunchControl> = {
  component: LaunchControl,
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
        </div>

      `,
    }),
  ],
  args: {
  },

};
export default meta;
type Story = StoryObj<LaunchControl>;

export const Base: Story = {};

export const Green: Story = {
  render: () => ({
    props: {
      color: 'green',
      comment: 'Green Indicator'
    },
  })
}

