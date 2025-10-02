import { QueueDetails } from './models/queue-details.model';
import { getConfig } from './utils/config';
import { SABService } from './services/sab.service';
import { UIService } from './services/ui.service';

import { Subject } from 'rxjs';

const config = getConfig();
const service = new SABService(config);
const ui = new UIService();
const stopPolling$ = new Subject<void>();

service.pollDetails(stopPolling$).subscribe({
    next: (apiResponse: { queue: QueueDetails } | null) => {
        const data = apiResponse?.queue ?? null;
        if (data) {
            ui.updateUI(data);
        } else {
            ui.log('No data received from poll\n');
        }
    },
    error: (err) => {
        console.error('Polling failed:', err);
        ui.stop();
    },
    complete: () => {
        ui.log('Polling stopped');
        ui.stop();
    }
});

process.on('SIGINT', () => {
    stopPolling$.next();
    stopPolling$.complete();
    ui.stop();
    process.exit(0);
});