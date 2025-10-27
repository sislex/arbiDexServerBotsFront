import {Meta, moduleMetadata, StoryObj} from '@storybook/angular';
import {FormLayout} from './form-layout';
import {fn} from 'storybook/test';


const meta: Meta<FormLayout> = {
  component: FormLayout,
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
            <app-form-layout [title]="title" [itemData]="itemData" (emitter)="emitter($event)">
              <div form class="form-settings" >
                  it's a form
              </div>
            </app-form-layout>
        </div>
    `,

    }),
  ],
  args: {
    emitter: fn(),
    title: 'Title',
    itemData: {}
  },
};
export default meta;
type Story = StoryObj<FormLayout>;

export const Base: Story = {};

export const WithoutData: Story = {
  args: {
    title: 'Create new item',
    itemData: {
    }
  },
};

export const WithData: Story = {
  args: {
    title: 'Update item',
    itemData: {
      id: 1,
    }
  },
};
