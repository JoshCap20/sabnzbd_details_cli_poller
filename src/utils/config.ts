import 'dotenv/config';

import { Configuration } from '../models/config.model';
import { InvalidArgumentError } from 'commander';

interface CommandOptions {
    host: string;
    port: number;
    apiKey: string;
    ssl: boolean;
    interval: number;
    retries: number;
    retryDelay: number;
    limit: number;
    theme: string;
}

function parseConfig(options: CommandOptions): Configuration {
    return {
        api_configuration: {
            host: options.host,
            port: options.port,
            api_key: options.apiKey,
            is_ssl: options.ssl,
        },
        monitoring_configuration: {
            poll_interval: options.interval,
            retry_attempts: options.retries,
            retry_delay: options.retryDelay,
            queue_item_limit: options.limit,
        },
        ui_configuration: {
            theme: options.theme
        },
    }
}

export function getConfig(options: CommandOptions): Configuration {
    const config = parseConfig(options);
    if (config.api_configuration.is_ssl) {
        console.warn('SSL Enabled: Connecting via SSL (make sure this is configured properly)');
    }
    if (config.monitoring_configuration.queue_item_limit > 20) {
        console.warn('20 is the max recommended queue item limit');
    }
    if (config.monitoring_configuration.poll_interval <= 100) {
        console.warn('Poll/interval of 1000 ms at least is recommended, sub 100 may not ever show');
    }
    return config;
}

export function customIntParser(value: string): number {
    const parsedValue = parseInt(value, 10);
    if (isNaN(parsedValue)) {
        throw new InvalidArgumentError('Not a number.');
    }
    return parsedValue;
}