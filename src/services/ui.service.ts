import * as cliProgress from 'cli-progress';

import { QueueDetails } from '../models/queue-details.model';
import { QueueItem } from '../models/queue-item.model';
import { mapStringToTheme } from '../utils/theme';
import { UIConfiguration } from '../models/config.model';

export class UIService {
    private multibar: cliProgress.MultiBar;
    private overallBar: cliProgress.SingleBar | null;
    private itemBars: Map<string, cliProgress.SingleBar>;
    private config: UIConfiguration;

    constructor(config: UIConfiguration, pollInterval: number) {
        this.config = config;
        this.multibar = this.initializeMultibar(pollInterval);
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
        this.updateOverallBar(data);
        this.removeUntrackedBars(data);
        for (const item of data.slots) {
            this.updateItemBar(item);
        }
    }

    private updateOverallBar(data: QueueDetails) {
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
                timeleft: data.timeleft,
                queuedItems: data.noofslots_total
            }, {
                format: ' {bar} | {percentage}% | {title} | Speed: {speed} | ETA: {timeleft} | Queued Items: {queuedItems} | {value}/{total} ' + overallUnit
            });
        } else {
            this.overallBar.update(downloadedMb, {
                title: 'Overall Queue',
                speed: data.speed,
                timeleft: data.timeleft,
                queuedItems: data.noofslots_total
            });
        }
    }

    private updateItemBar(item: QueueItem) {
        let itemTotalMb = parseFloat(item.mb);
        let itemDownloadedMb = itemTotalMb - parseFloat(item.mbleft);
        const truncatedName = this.truncateName(item.filename);
        const itemUnit = itemTotalMb >= 1024 ? 'GB' : 'MB';
        const itemScale = itemUnit === 'GB' ? 1024 : 1;
        itemTotalMb /= itemScale;
        itemDownloadedMb /= itemScale;

        let bar = this.itemBars.get(item.nzo_id);
        if (!bar) {
            bar = this.multibar.create(itemTotalMb, itemDownloadedMb, {
                title: truncatedName,
                status: item.status,
                timeleft: item.timeleft
            }, {
                format: ' {bar} | {percentage}% | {title} | {status} | ETA: {timeleft} | {value}/{total} ' + itemUnit
            });
            this.itemBars.set(item.nzo_id, bar);
        } else {
            bar.update(itemDownloadedMb, {
                title: truncatedName,
                status: item.status,
                timeleft: item.timeleft
            });
        }
    }

    private removeUntrackedBars(data: QueueDetails) {
        const currentIds = new Set(data.slots.map(item => item.nzo_id));

        for (const id of [...this.itemBars.keys()]) {
            if (!currentIds.has(id)) {
                const bar = this.itemBars.get(id);
                if (bar) this.multibar.remove(bar);
                this.itemBars.delete(id);
            }
        }
    }

    private initializeMultibar(pollInterval: number) {
        return new cliProgress.MultiBar({
            fps: pollInterval,
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
        }, mapStringToTheme(this.config.theme));
    }

    private truncateName(name: string): string {
        if (name.length > this.config.max_title_length) {
            return name.substring(0, this.config.max_title_length) + '...';
        }
        return name;
    }
}