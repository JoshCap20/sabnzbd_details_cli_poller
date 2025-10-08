import { Configuration } from "../models/config.model";

export class BaseService {
    static queue_details_query_param = 'mode=queue';
    static http_protocol = 'http';
    static https_protocol = 'https';

    constructor(protected configuration: Configuration) { }

    protected getDetailsUrl(): string {
        const jobsLimit: number | undefined = this.getQueueItemLimit();
        let url = `${this.getBaseUrl()}&${BaseService.queue_details_query_param}`;
        if (jobsLimit) {
            url += `&limit=${jobsLimit}`;
        }
        return url;
    }

    protected getPollInterval(): number {
        return this.configuration.queuePollingConfig.pollingInterval;
    }

    private getQueueItemLimit(): number {
        return this.configuration.queuePollingConfig.queueItemLimit;
    }

    private getBaseUrl(): string {
        return `${this.getProtocol()}://${this.configuration.apiConfig.host}:${this.configuration.apiConfig.port}/api?output=json&${this.getAPIKeyParam()}`;
    }

    private getProtocol(): string {
        return this.configuration.apiConfig.isSSL
            ? BaseService.https_protocol : BaseService.http_protocol;
    }

    private getAPIKeyParam(): string {
        return `apikey=${this.configuration.apiConfig.apiKey}`;
    }
}