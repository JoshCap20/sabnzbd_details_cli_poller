import { Configuration } from "../models/config.model";

export class BaseService {
    static queue_details_query_param: string = 'mode=queue';
    static http_protocol: string = 'http';
    static https_protocol: string = 'https';

    constructor(protected configuration: Configuration) { }

    protected getDetailsUrl(): string {
        const jobsLimit: number | undefined = this.getQueueItemLimit();
        let url: string = `${this.getBaseUrl()}&${BaseService.queue_details_query_param}`;
        if (jobsLimit) {
            url += `&limit=${jobsLimit}`;
        }
        return url;
    }

    protected getBaseUrl(): string {
        return `${this.getProtocol()}://${this.configuration.api_configuration.host}:${this.configuration.api_configuration.port}/api?output=json&${this.getAPIKeyParam()}`;
    }

    protected getProtocol(): string {
        return this.configuration.api_configuration.is_ssl
            ? BaseService.https_protocol : BaseService.http_protocol;
    }

    protected getAPIKeyParam(): string {
        return `apikey=${this.configuration.api_configuration.api_key}`;
    }

    protected getPollInterval(): number {
        return this.configuration.monitoring_configuration.poll_interval;
    }

    protected getQueueItemLimit(): number | undefined {
        return this.configuration.queue_item_limit ?? undefined;
    }
}