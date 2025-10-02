import { QueueDetails } from '../models/queue-details.model';

import * as cliProgress from 'cli-progress';
import { ThemeHelper } from '../utils/theme';

export class UIService {
    private multibar: cliProgress.MultiBar;
    private overallBar: cliProgress.SingleBar | null;
    private itemBars: Map<string, cliProgress.SingleBar>;

    constructor(theme: string) {
        this.multibar = UIService.getMultibar(5, theme);
        this.overallBar = null;
        this.itemBars = new Map<string, cliProgress.SingleBar>;
    }

    public stop() {
        this.multibar.stop();
    }

    public log(logContent: string) {
        this.multibar.log(logContent);
    }

    public updateUI(data: QueueDetails) {
        // Update overall bar
        let totalMb = parseFloat(data.mb);
        let downloadedMb = totalMb - parseFloat(data.mbleft);
        const overallUnit = totalMb >= 1024 ? 'GB' : 'MB';
        const overallScale = overallUnit === 'GB' ? 1024 : 1;
        totalMb /= overallScale;
        downloadedMb /= overallScale;

        if (!this.overallBar) {
            this.overallBar = this.multibar.create(totalMb, downloadedMb, {
                title: 'Overall Queue',
                speed: data.speed,
                timeleft: data.timeleft
            }, {
                format: ' {bar} | {percentage}% | {title} | Speed: {speed} | ETA: {timeleft} | {value}/{total} ' + overallUnit
            });
        } else {
            this.overallBar.update(downloadedMb, {
                title: 'Overall Queue',
                speed: data.speed,
                timeleft: data.timeleft
            });
        }

        // Track current item IDs
        const currentIds = new Set(data.slots.map(item => item.nzo_id));

        // Remove bars for completed/removed items
        for (const id of [...this.itemBars.keys()]) {
            if (!currentIds.has(id)) {
                const bar = this.itemBars.get(id);
                if (bar) this.multibar.remove(bar);
                this.itemBars.delete(id);
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

            let bar = this.itemBars.get(item.nzo_id);
            if (!bar) {
                bar = this.multibar.create(itemTotalMb, itemDownloadedMb, {
                    title: item.filename,
                    status: item.status,
                    timeleft: item.timeleft
                }, {
                    format: ' {bar} | {percentage}% | {title} | {status} | ETA: {timeleft} | {value}/{total} ' + itemUnit
                });
                this.itemBars.set(item.nzo_id, bar);
            } else {
                bar.update(itemDownloadedMb, {
                    title: item.filename,
                    status: item.status,
                    timeleft: item.timeleft
                });
            }
        }
    }

    private static getMultibar(poll_interval: number, theme: string) {
        return new cliProgress.MultiBar({
            fps: poll_interval,
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
        }, ThemeHelper.mapStringToTheme(theme));
    }
}