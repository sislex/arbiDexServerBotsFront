import {Meta, moduleMetadata, StoryObj} from '@storybook/angular';
import {TitleTableLayout} from './title-table-layout';


const meta: Meta<TitleTableLayout> = {
  component: TitleTableLayout,
  decorators: [
    moduleMetadata({
      imports: [],
      declarations: [],
      providers: [],
    }),
    (story) => ({
      ...story(),
      template: `
        <div style="width: 600px; height: 400px; background-color: green">
            <app-title-table-layout [title]="title" style="background-color: green; height: 100%">
              <div class="title-content-layout " style="background-color: #1ea7fd; height: 100%">
              content table
              </div>
            </app-title-table-layout>
        </div>
    `,

    }),
  ],
  args: {
    title: 'Title',
  },
};
export default meta;
type Story = StoryObj<TitleTableLayout>;

export const Base: Story = {};

export const WithoutData: Story = {
  args: {
    title: 'TABLE name',
  },
};
