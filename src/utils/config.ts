import 'dotenv/config';

import { Configuration } from '../models/config.model';
import { InvalidArgumentError } from 'commander';

export class ConfigHelper {
    public static getConfig(options: any): Configuration {
        const config = this.parseConfig(options);
        if (config.api_configuration.is_ssl) {
            console.warn('SSL Enabled: Connecting via SSL (make sure this is configured properly)')
        }
        if (config.monitoring_configuration.queue_item_limit > 20) {
            console.warn('20 is the max recommended queue item limit')
        }
        return config;
    }

    public static customIntParser(value: string): number {
        const parsedValue = parseInt(value, 10);
        if (isNaN(parsedValue)) {
            throw new InvalidArgumentError('Not a number.');
        }
        return parsedValue;
    }

    private static parseConfig(options: any): Configuration {
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
                ui_theme: options.theme
            },
        }
    }
}