import { QueueDetails } from '../models/queue-details.model';
import { APIService } from './api.service';
import { UIService } from './ui.service';

import { Subject } from 'rxjs';
import { Configuration } from '../models/config.model';

export class SABService {
    private apiService: APIService;
    private uiService: UIService;
    private stopPolling$: Subject<void>;

    constructor(private config: Configuration) {
        this.apiService = new APIService(this.config);
        this.uiService = new UIService(this.config.ui_configuration);
        this.stopPolling$ = new Subject<void>();
    }

    public poll() {
        this.apiService.pollDetails(this.stopPolling$).subscribe({
            next: (apiResponse: { queue: QueueDetails } | null) => {
                const data = apiResponse?.queue ?? null;
                if (data) {
                    this.uiService.updateUI(data);
                } else {
                    this.uiService.log('No data received from poll\n');
                }
            },
            error: (err) => {
                console.error('Polling failed:', err);
                this.uiService.stop();
            },
            complete: () => {
                this.uiService.log('Polling stopped');
                this.uiService.stop();
            }
        });
    }

    public interrupt() {
        this.stopPolling$.next();
        this.stopPolling$.complete();
        this.uiService.stop();
        process.exit(0);
    }
}