export class Constants {
    static readonly ENV_SAB_HOST: string = 'SAB_HOST';
    static readonly ENV_SAB_PORT: string = 'SAB_PORT';
    static readonly ENV_SAB_API_KEY: string = 'SAB_API_KEY';
    static readonly ENV_SAB_ITEM_LIMIT: string = 'SAB_ITEM_LIMIT';
    static readonly ENV_SAB_POLL_INTERVAL: string = 'SAB_POLL_INTERVAL';
    static readonly ENV_SAB_RETRY_ATTEMPTS: string = 'SAB_RETRY_ATTEMPTS';
    static readonly ENV_SAB_RETRY_DELAY: string = 'SAB_RETRY_DELAY';
    static readonly ENV_UI_THEME: string = 'UI_THEME';

    static readonly DEFAULT_PORT: number = 8080;
    static readonly DEFAULT_SSL: boolean = false;
    static readonly DEFAULT_QUEUE_LIMIT: number = 15;
    static readonly DEFAULT_POLL_INTERVAL: number = 2000;
    static readonly DEFAULT_RETRY_ATTEMPTS: number = 3;
    static readonly DEFAULT_RETRY_DELAY: number = 2000;

    static readonly DESC_HOST: string = 'Set host address (e.g. 192.168.1.71)';
    static readonly DESC_PORT: string = 'Set port number (e.g. 8080)';
    static readonly DESC_SSL: string = 'Uses HTTPS protocol for connection';
    static readonly DESC_API_KEY: string = 'Set API key (retrieved from sabnzbd';
    static readonly DESC_QUEUE_LIMIT: string = 'Set queue item limit';
    static readonly DESC_POLL_INTERVAL: string = 'Set the polling interval in milliseconds';
    static readonly DESC_RETRY_ATTEMPTS: string = 'Set retry attempts for API calls';
    static readonly DESC_RETRY_DELAY: string = 'Set delay on retry for API calls';
    static readonly DESC_THEME: string = 'Set UI theme';
}
