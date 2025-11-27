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
import {IBotInfo} from '../../models/servers';

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
  newJobInfo: string | null = null;
  allSettings!: IBotInfo;

  ngOnInit() {
    this.jobInfo$.pipe(take(1)).subscribe(jobInfo => {
      this.allSettings = structuredClone(jobInfo);
      this.newJobInfo = JSON.stringify(jobInfo.jobParams, null, 2);
    });
  }

  events(event: any) {
    this.newJobInfo = event.data;
  }

  clickButton(note: string) {

    if (note === 'Bot set') {
      const parsedJobParams = JSON.parse(this.newJobInfo!);

      const newSettingsObject: IBotInfo = {
        ...this.allSettings,
        jobParams: parsedJobParams
      };

      const newSettingsJson: string = JSON.stringify(newSettingsObject);

      this.store.dispatch(
        setBotSettings({
          id: this.allSettings.id,
          settings: newSettingsJson
        })
      );
    }

    else if (note === 'Reset') {
      this.jobInfo$.pipe(take(1)).subscribe(jobInfo => {
        this.allSettings = structuredClone(jobInfo);
        this.newJobInfo = JSON.stringify(jobInfo.jobParams, null, 2);
      });
    }
  }

}
