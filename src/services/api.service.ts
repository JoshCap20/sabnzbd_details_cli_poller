import { Observable, catchError, from, interval, map, of, Subject, switchMap, takeUntil } from 'rxjs';
import axios from 'axios';

import { QueueDetails } from "../models/queue-details.model";
import { BaseService } from "./base.service";

export class APIService extends BaseService {
    public pollDetails(stopPolling$: Subject<void>): Observable<{ queue: QueueDetails; } | null> {
        return interval(this.getPollInterval()).pipe(
            switchMap(() => from(axios.get<{ queue: QueueDetails }>(this.getDetailsUrl())).pipe(
                map(response => response.data)
            )),
            catchError(error => {
                console.log(`Polling error: ${error.message}\n`);
                return of(null);
            }),
            takeUntil(stopPolling$)
        );
    }
}