import 'dotenv/config';
import { Configuration } from '../models/config.model';

export class ConfigHelper {
    public static getConfig(options?: any): Configuration {
        const config = this.parseConfig();
        if (options) {
            this.overrideConfig(options, config);
            console.log(config);
        }
        this.validateConfig(config);
        if (config.api_configuration.is_ssl) {
            console.warn('SSL Enabled: Connecting via SSL (make sure this is configured properly)')
        }
        if (config.monitoring_configuration.queue_item_limit > 20) {
            console.warn('20 is the max recommended queue item limit')
        }
        return config;
    }

    public static overrideConfig(options: any, config: Configuration) {
        if (options.limit) {
            config.monitoring_configuration.queue_item_limit = this.parseStringAsInteger("limit", options.limit);
        }
        if (options.interval) {
            config.monitoring_configuration.poll_interval = this.parseStringAsInteger("interval", options.interval);
        }
    }

    private static parseStringAsInteger(optionName: string, str: string): number {
        const valueAsInt = parseInt(str);
        if (Number.isSafeInteger(valueAsInt)) {
            return valueAsInt;
        }
        throw new Error(`${optionName} should be a valid integer`);
    }

    private static validateConfig(config: Configuration) {
        if (!config.api_configuration.host) throw new Error("SAB_HOST is required");
        if (!config.api_configuration.port) throw new Error("SAB_PORT is required and must be a number");
        if (!config.api_configuration.api_key) throw new Error("SAB_API_KEY is required");

        if (!config.monitoring_configuration.poll_interval) throw new Error("SAB_POLL_INTERVAL is required and must be a number");
        if (!config.monitoring_configuration.retry_attempts) throw new Error("SAB_RETRY_ATTEMPTS is required and must be a number");
        if (!config.monitoring_configuration.retry_delay) throw new Error("SAB_RETRY_DELAY is required and must be a number");

        if (!config.ui_configuration.ui_theme) throw new Error("UI_THEME is required");
    }

    private static parseConfig(): Configuration {
        return {
            api_configuration: {
                host: process.env.SAB_HOST || '',
                port: parseInt(process.env.SAB_PORT || ''),
                api_key: process.env.SAB_API_KEY || '',
                is_ssl: (process.env.SAB_SSL == 'true' ? true : false) || false,
            },
            monitoring_configuration: {
                poll_interval: parseInt(process.env.SAB_POLL_INTERVAL || ''),
                retry_attempts: parseInt(process.env.SAB_RETRY_ATTEMPTS || ''),
                retry_delay: parseInt(process.env.SAB_RETRY_DELAY || ''),
                queue_item_limit: parseInt(process.env.SAB_ITEM_LIMIT || '20')
            },
            ui_configuration: {
                ui_theme: process.env.UI_THEME || '',
            },
        }
    }
}