import {Meta, moduleMetadata, StoryObj} from '@storybook/angular';
import {AgGridRulesTable} from './ag-grid-rules-table';
import {IRule_1, IRule_2} from './stabs';

const meta: Meta<AgGridRulesTable> = {
  component: AgGridRulesTable,
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
type Story = StoryObj<AgGridRulesTable>;

export const Base: Story = {};

export const OneRow: Story = {
  args: {
    rowData: IRule_1,
  },
};

export const FiveRow: Story = {
  args: {
    rowData: IRule_2,
  },
};
