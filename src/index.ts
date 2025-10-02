import { QueueDetails } from './models/queue-details.model';
import { getConfig } from './utils/config';
import { SABService } from './services/sab.service';

import { Subject } from 'rxjs';
import * as cliProgress from 'cli-progress';

const config = getConfig();
const service = new SABService(config);
const stopPolling$ = new Subject<void>();

const multibar = new cliProgress.MultiBar({
    fps: config.ui_configuration.ui_refresh_rate,
    clearOnComplete: true,
    hideCursor: true,
    format: ' {bar} | {percentage}% | {title} | ETA: {eta_formatted} | {value}/{total} MB',  // Default format (overridable per bar)
    formatValue: (v, options, type) => {
        if (type === 'value' || type === 'total') {
            return v.toFixed(2);
        } else if (type === 'percentage') {
            return Math.floor(v).toString();
        } else {
            return v.toString();
        }
    }
}, cliProgress.Presets.shades_grey);

let overallBar: cliProgress.SingleBar | null = null;
const itemBars = new Map<string, cliProgress.SingleBar>();

service.pollDetails(stopPolling$).subscribe({
    next: (apiResponse: { queue: QueueDetails } | null) => {
        const data = apiResponse?.queue ?? null;
        if (data) {
            updateUI(data);
        } else {
            multibar.log('No data received from poll\n');
        }
    },
    error: (err) => {
        console.error('Polling failed:', err);
        multibar.stop();
    },
    complete: () => {
        console.log('Polling stopped');
        multibar.stop();
    }
});

process.on('SIGINT', () => {
    stopPolling$.next();
    stopPolling$.complete();
    multibar.stop();
    process.exit(0);
});

function updateUI(data: QueueDetails) {
    // Update overall bar
    let totalMb = parseFloat(data.mb);
    let downloadedMb = totalMb - parseFloat(data.mbleft);
    const overallUnit = totalMb >= 1024 ? 'GB' : 'MB';
    const overallScale = overallUnit === 'GB' ? 1024 : 1;
    totalMb /= overallScale;
    downloadedMb /= overallScale;

    if (!overallBar) {
        overallBar = multibar.create(totalMb, downloadedMb, {
            title: 'Overall Queue',
            speed: data.speed,
            timeleft: data.timeleft
        }, {
            format: ' {bar} | {percentage}% | {title} | Speed: {speed} | ETA: {timeleft} | {value}/{total} ' + overallUnit
        });
    } else {
        overallBar.update(downloadedMb, {
            title: 'Overall Queue',
            speed: data.speed,
            timeleft: data.timeleft
        });
    }

    // Track current item IDs
    const currentIds = new Set(data.slots.map(item => item.nzo_id));

    // Remove bars for completed/removed items
    for (const id of [...itemBars.keys()]) {
        if (!currentIds.has(id)) {
            const bar = itemBars.get(id);
            if (bar) multibar.remove(bar);
            itemBars.delete(id);
        }
    }

    // Add/update bars for each queue item
    for (const item of data.slots) {
        let itemTotalMb = parseFloat(item.mb);
        let itemDownloadedMb = itemTotalMb - parseFloat(item.mbleft);
        const itemUnit = itemTotalMb >= 1024 ? 'GB' : 'MB';
        const itemScale = itemUnit === 'GB' ? 1024 : 1;
        itemTotalMb /= itemScale;
        itemDownloadedMb /= itemScale;

        let bar = itemBars.get(item.nzo_id);
        if (!bar) {
            bar = multibar.create(itemTotalMb, itemDownloadedMb, {
                title: item.filename,
                status: item.status,
                timeleft: item.timeleft
            }, {
                format: ' {bar} | {percentage}% | {title} | {status} | ETA: {timeleft} | {value}/{total} ' + itemUnit
            });
            itemBars.set(item.nzo_id, bar);
        } else {
            bar.update(itemDownloadedMb, {
                title: item.filename,
                status: item.status,
                timeleft: item.timeleft
            });
        }
    }
}