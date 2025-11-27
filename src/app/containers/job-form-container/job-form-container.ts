import {Component, inject, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {InputTextArea} from '../../components/input-text-area/input-text-area';
import {Store} from '@ngrx/store';
import {getInfoActiveBot} from '../../+state/servers/servers.selectors';
import {AsyncPipe, JsonPipe} from '@angular/common';
import {setBotSettings} from '../../+state/servers/servers.actions';
import {take} from 'rxjs';

@Component({
  selector: 'app-job-form-container',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    InputTextArea,
    AsyncPipe,
    JsonPipe,
  ],
  standalone: true,
  templateUrl: './job-form-container.html',
  styleUrl: './job-form-container.scss',
})
export class JobFormContainer implements OnInit {
  private store = inject(Store)

  jobInfo$ = this.store.select(getInfoActiveBot);
  newJobInfo: any = null;

  ngOnInit() {
    this.jobInfo$.pipe(take(1)).subscribe(jobInfo => {
      this.newJobInfo = JSON.stringify(jobInfo, null, 2);
    });
  }

  events(event: any) {
    this.newJobInfo = event.data;
  }

  clickButton(note: string) {
    if (note === 'Bot set') {
      const parsed = JSON.parse(this.newJobInfo);
      this.store.dispatch(setBotSettings({ id: parsed.id, settings: this.newJobInfo }));
    }

    else if (note === 'Reset') {
      this.jobInfo$.pipe(take(1)).subscribe(jobInfo => {
        this.newJobInfo = JSON.stringify(jobInfo, null, 2);
      });
    }
  }

}
