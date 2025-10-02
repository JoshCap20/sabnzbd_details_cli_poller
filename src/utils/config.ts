import 'dotenv/config';

import { Configuration } from '../models/config.model';

export class ConfigHelper {
    public static getConfig(options: any): Configuration {
        const config = this.parseConfig(options);
        this.validateConfig(config);
        if (config.api_configuration.is_ssl) {
            console.warn('SSL Enabled: Connecting via SSL (make sure this is configured properly)')
        }
        if (config.monitoring_configuration.queue_item_limit > 20) {
            console.warn('20 is the max recommended queue item limit')
        }
        return config;
    }

    private static validateConfig(config: Configuration) {
        if (!config.api_configuration.host) throw new Error("SAB_HOST is required");
        if (!config.api_configuration.port) throw new Error("SAB_PORT is required and must be a number");
        if (!config.api_configuration.api_key) throw new Error("SAB_API_KEY is required");

        if (!config.monitoring_configuration.poll_interval) throw new Error("SAB_POLL_INTERVAL is required and must be a number");
        if (!config.monitoring_configuration.retry_attempts) throw new Error("SAB_RETRY_ATTEMPTS is required and must be a number");
        if (!config.monitoring_configuration.retry_delay) throw new Error("SAB_RETRY_DELAY is required and must be a number");
    }

    private static parseConfig(options: any): Configuration {
        return {
            api_configuration: {
                host: options.host,
                port: options.port,
                api_key: options.apiKey,
                is_ssl: options.ssl,
            },
            // TODO: Push parsing to options
            monitoring_configuration: {
                poll_interval: parseInt(options.interval),
                retry_attempts: parseInt(options.retries),
                retry_delay: parseInt(options.retryDelay),
                queue_item_limit: parseInt(options.limit)
            },
            ui_configuration: {
                ui_theme: options.theme
            },
        }
    }
}