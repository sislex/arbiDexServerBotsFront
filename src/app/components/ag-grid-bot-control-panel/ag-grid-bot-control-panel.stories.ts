import {Meta, moduleMetadata, StoryObj} from '@storybook/angular';
import {AgGridBotControlPanel} from './ag-grid-bot-control-panel';
import {botsControlStabs_1} from '../ag-grid-bots-control/stabs';

const meta: Meta<AgGridBotControlPanel> = {
  component: AgGridBotControlPanel,
  decorators: [
    moduleMetadata({
      imports: [],
      declarations: [],
      providers: [],
    }),
    (story) => ({
      ...story(),
      template: `
        <div style="width: 100%; height: 500px;">
          ${story().template}
        </div>
      `,
    }),
  ],
  args: {
  },

};
export default meta;
type Story = StoryObj<AgGridBotControlPanel>;

export const Base: Story = {};

export const OneRow: Story = {
  args: {
    rowData: botsControlStabs_1,
  },
};
