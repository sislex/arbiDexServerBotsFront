import {Component, Input} from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import {TitleCasePipe} from '@angular/common';

@Component({
  selector: 'app-tabs',
  imports: [MatTabsModule, TitleCasePipe],
  standalone: true,
  templateUrl: './tabs.html',
  styleUrl: './tabs.scss'
})
export class Tabs {
  @Input() list: any[] = [
    {
      name: 'BOTS',
      data: [
        {
          title: 'first, table',
          type: 'table',
          rowData: [
            { make: "Tesla", model: "Model Y", price: 64950, electric: true },
            { make: "Ford", model: "F-Series", price: 33850, electric: false },
            { make: "Toyota", model: "Corolla", price: 29600, electric: false },
            { make: "Toyota", model: "Corolla", price: 29600, electric: false },
          ],

          colDefs: [
            { field: "make", flex: 1},
            { field: "model", flex: 1},
            { field: "price", flex: 1},
            { field: "electric", flex: 1}
          ],
        },
        {
          title: 'GATES',
          type: 'table',
          rowData: [
            { make: "Tesla1", model: "Model Y", price: 64950, electric: true },
            { make: "Ford1", model: "F-Series", price: 33850, electric: false },
            { make: "Toyota1", model: "Corolla", price: 29600, electric: false },
            { make: "Toyota1", model: "Corolla", price: 29600, electric: false },
          ],

          colDefs: [
            { field: "make", flex: 1},
            { field: "model", flex: 1},
            { field: "price", flex: 1},
            { field: "electric", flex: 1}
          ],
        },
      ]
    },
    {
      name: 'SERVER DATA',

      data: [
        {
          title: 'first, table',
          type: 'table',
          rowData: [
            { make: "Tesla", model: "Model Y", price: 64950, electric: true },
            { make: "Ford", model: "F-Series", price: 33850, electric: false },
            { make: "Toyota", model: "Corolla", price: 29600, electric: false },
            { make: "Toyota", model: "Corolla", price: 29600, electric: false },
          ],

          colDefs: [
            { field: "make", flex: 1},
            { field: "model", flex: 1},
            { field: "price", flex: 1},
            { field: "electric", flex: 1}
          ],
        }
      ]
    },
    {
      name: '3433333',

      data: [
        {
          title: 'first, table',
          type: 'table',
          rowData: [
            { make: "Tesla3", model: "Model Y", price: 64950, electric: true },
            { make: "Ford3", model: "F-Series", price: 33850, electric: false },
            { make: "Toyota3", model: "Corolla", price: 29600, electric: false },
            { make: "Toyota3", model: "Corolla", price: 29600, electric: false },
          ],

          colDefs: [
            { field: "make", flex: 1},
            { field: "model", flex: 1},
            { field: "price", flex: 1},
            { field: "electric", flex: 1}
          ],
        }
      ]
    },
  ];
}
