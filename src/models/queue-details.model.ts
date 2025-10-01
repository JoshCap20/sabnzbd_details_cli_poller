import { QueueItem } from "./queue-item.model";

export interface QueueDetails {
    status: string;
    speedlimit: string;
    speedlimit_abs: string;
    paused: boolean;
    noofslots_total: number;
    noofslots: number;
    limit: number;
    start: number;
    timeleft: string;
    speed: string;
    kbpersec: string;
    size: string;
    sizeleft: string;
    mb: string;
    mbleft: string;
    have_warnings: string;
    diskspace1_norm: string;
    diskspacetotal1: string;
    slots: QueueItem[];
}