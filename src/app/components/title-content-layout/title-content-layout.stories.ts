import {Meta, moduleMetadata, StoryObj} from '@storybook/angular';
import {TitleContentLayout} from './title-content-layout';


const meta: Meta<TitleContentLayout> = {
  component: TitleContentLayout,
  decorators: [
    moduleMetadata({
      imports: [],
      declarations: [],
      providers: [],
    }),
    (story) => ({
      ...story(),
      template: `
        <div style="width: 100%; height: 900px; background-color: green">
            <app-title-content-layout [title]="title" style="background-color: green">
              <div class="content" style="background-color: #1ea7fd">
              content
              </div>
            </app-title-content-layout>
        </div>
    `,

    }),
  ],
  args: {
    title: 'Title',
  },
};
export default meta;
type Story = StoryObj<TitleContentLayout>;

export const Base: Story = {};

export const WithoutData: Story = {
  args: {
    title: 'Tab Name Title',
  },
};
