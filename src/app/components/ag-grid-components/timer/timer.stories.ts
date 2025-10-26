import {Meta, moduleMetadata, StoryObj} from '@storybook/angular';
import {AgGridAngular} from 'ag-grid-angular';
import {Timer} from './timer';

const meta: Meta<Timer> = {
  component: Timer,
  decorators: [
    moduleMetadata({
      imports: [AgGridAngular],
      declarations: [],
      providers: [],
    }),
    (story) => ({
      ...story(),
      template: `
        <div style="width: 300px; height: 100px; background-color: #f5f5f5; padding: 20px;">
          ${story().template}
        </div>
      `,
    }),
  ],
  args: {
  },

};
export default meta;
type Story = StoryObj<Timer>;

export const Base: Story = {};

// Функция для создания mock параметров
const createParams = (timestamp: number) => ({
  value: timestamp
});

export const FutureTimer: Story = {
  render: () => ({
    template: `
      <app-timer [params]="params"></app-timer>
    `,
    props: {
      params: createParams(Date.now() + 2 * 60 * 60 * 1000 + 30 * 60 * 1000 + 15 * 1000) // 2 часа 30 минут 15 секунд в будущем
    }
  })
};

export const PastTimer: Story = {
  render: () => ({
    template: `
      <app-timer [params]="params"></app-timer>
    `,
    props: {
      params: createParams(Date.now() - 1 * 24 * 60 * 60 * 1000 - 5 * 60 * 60 * 1000 - 45 * 60 * 1000) // 1 день 5 часов 45 минут в прошлом
    }
  })
};

export const LongFutureTimer: Story = {
  render: () => ({
    template: `
      <app-timer [params]="params"></app-timer>
    `,
    props: {
      params: createParams(Date.now() + 3 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000) // 3 дня 12 часов в будущем
    }
  })
};

export const ShortFutureTimer: Story = {
  render: () => ({
    template: `
      <app-timer [params]="params"></app-timer>
    `,
    props: {
      params: createParams(Date.now() + 2 * 60 * 1000 + 30 * 1000) // 2 минуты 30 секунд в будущем
    }
  })
};

export const NoTimestamp: Story = {
  render: () => ({
    template: `
      <app-timer [params]="params"></app-timer>
    `,
    props: {
      params: createParams(0) // Нет timestamp
    }
  })
};
//
// export const InAgGrid: Story = {
//   decorators: [
//     (story) => ({
//       ...story(),
//       template: `
//         <div style="width: 100%; height: 400px;">
//           <ag-grid-angular
//             style="width: 100%; height: 100%;"
//             class="ag-theme-alpine"
//             [rowData]="rowData"
//             [columnDefs]="columnDefs"
//           ></ag-grid-angular>
//         </div>
//       `,
//     }),
//   ],
//   render: () => ({
//     props: {
//       rowData: [
//         {
//           futureTime: Date.now() + 2 * 60 * 60 * 1000, // 2 часа в будущем
//           pastTime: Date.now() - 1 * 60 * 60 * 1000,   // 1 час в прошлом
//           longFuture: Date.now() + 5 * 24 * 60 * 60 * 1000, // 5 дней в будущем
//           noTime: null
//         },
//         {
//           futureTime: Date.now() + 30 * 60 * 1000,     // 30 минут в будущем
//           pastTime: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 дня в прошлом
//           longFuture: Date.now() + 1 * 24 * 60 * 60 * 1000, // 1 день в будущем
//           noTime: null
//         }
//       ],
//       columnDefs: [
//         { headerName: 'Future Timer', field: 'futureTime', cellRenderer: Timer },
//         { headerName: 'Past Timer', field: 'pastTime', cellRenderer: Timer },
//         { headerName: 'Long Future', field: 'longFuture', cellRenderer: Timer },
//         { headerName: 'No Time', field: 'noTime', cellRenderer: Timer }
//       ]
//     }
//   })
// };
