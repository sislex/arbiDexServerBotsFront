import {Component, inject, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {AgGridBotsControl} from '../../components/ag-grid-bots-control/ag-grid-bots-control';
import {AgGridErrorList} from '../../components/ag-grid-error-list/ag-grid-error-list';
import {TitleTableLayout} from '../../components/title-table-layout/title-table-layout';
import {AgGridBotDataList} from '../../components/ag-grid-bot-data-list/ag-grid-bot-data-list';
import {AsyncPipe} from '@angular/common';
import {getActiveServerIpPort, getDataActiveBot} from '../../+state/servers/servers.selectors';
import {TitleContentLayout} from '../../components/title-content-layout/title-content-layout';
import {Actions} from '../../components/ag-grid-components/actions/actions';
import {ActivatedRoute, Router} from '@angular/router';
import {take} from 'rxjs';
import {clearActiveElementData, setActiveServer} from '../../+state/servers/servers.actions';

@Component({
    selector: 'app-bot-info-page-container',
    imports: [
        AgGridBotsControl,
        AgGridErrorList,
        TitleTableLayout,
        AgGridBotDataList,
        AsyncPipe,
        TitleContentLayout,
        Actions,
    ],
    standalone: true,
    templateUrl: './bot-info-page-container.html',
    styleUrl: './bot-info-page-container.scss',
})
export class BotInfoPageContainer implements OnInit {
    private store = inject(Store);
    private router = inject(Router);

    private route=inject(ActivatedRoute);

    dataActiveBot$ = this.store.select(getDataActiveBot)
    ipPort$ = this.store.select(getActiveServerIpPort);


    ngOnInit() {
        console.log('тут вызвать диспатч - делаем следующее:')

        console.log('сохраняю id в стейт')
        console.log('в эффекте делаю запросы на данные о боте, его ответы, его ошибки по ip, port и id из стэйта')

        this.route.paramMap.subscribe(params => {
            const ipPort = params.get('ipPort');

            if (ipPort !== null) {
                const [ip, port] = ipPort.split(':');
                this.store.dispatch(clearActiveElementData());
                this.store.dispatch(setActiveServer({ ip, port }));
            }
        });
    }

    events($event: any) {
        console.log($event)
    }

    onAction($event: any, note: string) {
        if ($event.event === 'Actions:ACTION_CLICKED') {
            if (note === 'reply') {
                this.ipPort$.pipe(take(1)).subscribe(ipPort => {
                    if (ipPort) {
                        this.router.navigate([`/server/${ipPort}/tab/bots`]);
                    }
                });
            }
        }
    }
}
