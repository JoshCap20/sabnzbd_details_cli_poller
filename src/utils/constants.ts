export class Constants {
    static readonly ENV_SAB_HOST = 'SAB_HOST';
    static readonly ENV_SAB_PORT = 'SAB_PORT';
    static readonly ENV_SAB_API_KEY = 'SAB_API_KEY';
    static readonly ENV_SAB_ITEM_LIMIT = 'SAB_ITEM_LIMIT';
    static readonly ENV_SAB_POLL_INTERVAL = 'SAB_POLL_INTERVAL';
    static readonly ENV_SAB_RETRY_ATTEMPTS = 'SAB_RETRY_ATTEMPTS';
    static readonly ENV_SAB_RETRY_DELAY = 'SAB_RETRY_DELAY';
    static readonly ENV_UI_THEME = 'UI_THEME';

    static readonly DEFAULT_PORT = '8080';
    static readonly DEFAULT_SSL = false;
    static readonly DEFAULT_QUEUE_LIMIT = '15';
    static readonly DEFAULT_POLL_INTERVAL = '2000';
    static readonly DEFAULT_RETRY_ATTEMPTS = '3';
    static readonly DEFAULT_RETRY_DELAY = 2000;

    static readonly DESC_DEFAULT_PORT = 'Default port 8080';
    static readonly DESC_DEFAULT_QUEUE_LIMIT = 'Shows top 15 queue items';
    static readonly DESC_DEFAULT_POLL_INTERVAL = 'Refreshes every 3 seconds';
    static readonly DESC_DEFAULT_RETRY_ATTEMPTS = 'Retries 3 times';
    static readonly DESC_DEFAULT_RETRY_DELAY = 'Waits 2000 milliseconds';
}
