import {Component, inject, OnInit} from '@angular/core';
import {TitleTableLayout} from '../../components/title-table-layout/title-table-layout';
import {AgGridApiListContainer} from '../ag-grid-api-list-container/ag-grid-api-list-container';
import {ConfirmationPopUp} from '../../components/confirmation-pop-up/confirmation-pop-up';
import {MatDialogRef} from '@angular/material/dialog';
import {Store} from '@ngrx/store';
import {setApiList} from '../../+state/servers/servers.actions';

@Component({
  selector: 'app-api-list-container',
  imports: [
    TitleTableLayout,
    AgGridApiListContainer,
    ConfirmationPopUp
  ],
  standalone: true,
  templateUrl: './api-list-container.html',
  styleUrl: './api-list-container.scss',
})
export class ApiListContainer implements OnInit {
  private dialogRef = inject(MatDialogRef<ApiListContainer>);
  private store = inject(Store);

  ngOnInit() {
    this.store.dispatch(setApiList())
  }
  events($event: any) {
    this.dialogRef.close($event);
  }
}
