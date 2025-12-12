import {Meta, moduleMetadata, StoryObj} from '@storybook/angular';
import {AgGridErrorList} from './ag-grid-error-list';
import {errorListStabs_1, errorListStabs_2, errorListStabs_3} from '../+stabs/error-list-stabs';


const meta: Meta<AgGridErrorList> = {
  component: AgGridErrorList,
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
type Story = StoryObj<AgGridErrorList>;

export const Base: Story = {};

export const oneError: Story = {
  args: {
    rowData: errorListStabs_1
  },
};

export const fiveErrors: Story = {
  args: {
    rowData: errorListStabs_2,
  },
};

export const BigDataErrors: Story = {
  args: {
    rowData: errorListStabs_3,
  },
};
