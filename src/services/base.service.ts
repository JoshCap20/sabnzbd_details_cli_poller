import { Configuration, MonitoringConfiguration } from "../models/config.model";
import { QUEUE_DETAILS_ENDPOINT } from "../utils/api-constants";

export class BaseService {

    constructor(protected configuration: Configuration) { }

    protected getDetailsUrl(jobsLimit?: number | undefined): string {
        return jobsLimit ?
            this.getBaseUrl() + this.getAPIKeyParam() + QUEUE_DETAILS_ENDPOINT + "&limit=" + jobsLimit
            : this.getBaseUrl() + this.getAPIKeyParam() + QUEUE_DETAILS_ENDPOINT;
    }

    protected getBaseUrl(): string {
        const protocol = this.configuration.api_configuration.is_ssl ? 'https' : 'http';
        return `${protocol}://${this.configuration.api_configuration.host}:${this.configuration.api_configuration.port}/api?output=json`;
    }

    protected getAPIKeyParam(): string {
        return `&apikey=${this.configuration.api_configuration.api_key}`;
    }

    protected getPollInterval(): number {
        return this.configuration.monitoring_configuration.poll_interval;
    }

    protected getQueueItemLimit(): number | undefined {
        return this.configuration.queue_item_limit ?? undefined;
    }
}