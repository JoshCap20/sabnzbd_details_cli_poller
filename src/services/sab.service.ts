import { Configuration } from "../models/config.model";
import { QUEUE_DETAILS_ENDPOINT } from "../utils/api-constants";

export class SABService {

    constructor(private configuration: Configuration) { }

    public getDetailsUrl(jobsLimit?: number): string {
        return jobsLimit ?
            this.getBaseUrl() + this.getAPIKeyParam() + QUEUE_DETAILS_ENDPOINT + "&limit=" + jobsLimit
            : this.getBaseUrl() + this.getAPIKeyParam() + QUEUE_DETAILS_ENDPOINT;
    }

    // TODO: Refactor to inherit these from parent
    private getBaseUrl(): string {
        const protocol = this.configuration.api_configuration.is_ssl ? 'https' : 'http';
        return `${protocol}://${this.configuration.api_configuration.host}:${this.configuration.api_configuration.port}/api?output=json`;
    }

    private getAPIKeyParam(): string {
        return `&apikey=${this.configuration.api_configuration.api_key}`;
    }
}