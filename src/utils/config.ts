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
    titleLength: number;
    barSize: number;
    coloredStatus: boolean;
}

function parseConfig(options: CommandOptions): Configuration {
    return {
        apiConfig: {
            host: options.host,
            port: options.port,
            apiKey: options.apiKey,
            isSSL: options.ssl,
        },
        queuePollingConfig: {
            pollingInterval: options.interval,
            retryAttempts: options.retries,
            retryDelay: options.retryDelay,
            queueItemLimit: options.limit,
        },
        uiConfig: {
            theme: options.theme,
            maxTitleLength: options.titleLength,
            barSize: options.barSize,
            isColoredStatus: options.coloredStatus
        },
    }
}

export function getConfig(options: CommandOptions): Configuration {
    const config = parseConfig(options);
    if (config.apiConfig.isSSL) {
        console.warn('SSL Enabled: Connecting via SSL (make sure this is configured properly)');
    }
    if (config.queuePollingConfig.queueItemLimit > 20) {
        console.warn('20 is the max recommended queue item limit');
    }
    if (config.queuePollingConfig.pollingInterval <= 100) {
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