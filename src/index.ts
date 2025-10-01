import { getSABService } from "./services/sab.factory.service";
import { QueueDetails } from './models/queue-details.model';

import { catchError, from, interval, map, of, Subject, switchMap, takeUntil } from 'rxjs';
import axios from 'axios';
import * as cliProgress from 'cli-progress';  // Updated import (namespace)

const service = getSABService();

const pollIntervalMs = 5000;  // Poll every 5 seconds
const stopPolling$ = new Subject<void>();  // To manually stop polling

// Create MultiBar instance with custom options
const multibar = new cliProgress.MultiBar({
    fps: 5,  // Lower for less CPU usage
    clearOnComplete: true,  // Clear bars when done
    hideCursor: true,  // Hide cursor for clean UI
    format: ' {bar} | {percentage}% | {title} | ETA: {eta_formatted} | {value}/{total} MB',  // Default format (overridable per bar)
}, cliProgress.Presets.shades_classic);  // Use a preset for styling

let overallBar: cliProgress.SingleBar | null = null;  // Overall queue bar
const itemBars = new Map<string, cliProgress.SingleBar>();  // Map of nzo_id to item bars

const pollingObservable = interval(pollIntervalMs).pipe(
    switchMap(() => from(axios.get<{ queue: QueueDetails }>(service.getDetailsUrl(5))).pipe(
        map(response => response.data)
    )),
    catchError(error => {
        multibar.log(`Polling error: ${error.message}\n`);  // Log errors above bars
        return of(null);
    }),
    takeUntil(stopPolling$)
);

// Subscribe and update CLI in place
pollingObservable.subscribe({
    next: (apiResponse: { queue: QueueDetails } | null) => {
        const data = apiResponse?.queue ?? null;
        if (data) {
            // Log the full data for debugging (use JSON.stringify to show all properties deeply)
            // console.log('Polled data:', JSON.stringify(data, null, 2));

            // Update overall bar
            const totalMb = parseFloat(data.mb);
            const downloadedMb = totalMb - parseFloat(data.mbleft);
            if (!overallBar) {
                overallBar = multibar.create(totalMb, downloadedMb, {
                    title: 'Overall Queue',
                    speed: data.speed,
                    timeleft: data.timeleft
                }, {
                    format: ' {bar} | {percentage}% | {title} | Speed: {speed} | ETA: {timeleft} | {value}/{total} MB'
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
                const totalMb = parseFloat(item.mb);
                const downloadedMb = totalMb - parseFloat(item.mbleft);
                let bar = itemBars.get(item.nzo_id);
                if (!bar) {
                    bar = multibar.create(totalMb, downloadedMb, {
                        title: item.filename,
                        status: item.status,
                        timeleft: item.timeleft
                    }, {
                        format: ' {bar} | {percentage}% | {title} | {status} | ETA: {timeleft} | {value}/{total} MB'
                    });
                    itemBars.set(item.nzo_id, bar);
                } else {
                    bar.update(downloadedMb, {
                        title: item.filename,
                        status: item.status,
                        timeleft: item.timeleft
                    });
                }
            }
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
        multibar.stop();  // Clean up bars
    }
});

// Handle Ctrl+C to stop polling and clean up
process.on('SIGINT', () => {
    stopPolling$.next();
    stopPolling$.complete();
    multibar.stop();
    process.exit(0);
});