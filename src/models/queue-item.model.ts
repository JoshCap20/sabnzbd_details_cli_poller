export interface QueueItem {
    status: string;
    index: number;
    password: string;
    avg_age: string;
    time_added: number;
    script: string;
    direct_unpack: string;
    mb: string;
    mbleft: string;
    mbmissing: string;
    size: string;
    sizeleft: string;
    filename: string;
    labels: string[];
    priority: string;
    cat: string;
    timeleft: string;
    percentage: string;
    nzo_id: string;
    unpackopts: string;
}