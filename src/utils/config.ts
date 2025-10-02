import 'dotenv/config';
import { Configuration } from '../models/config.model';

export function getConfig(): Configuration {
    const config = parseConfig();
    validateConfig(config);
    return config;
}

function validateConfig(config: Configuration) {
    if (!config.api_configuration.host) throw new Error("SAB_HOST is required");
    if (!config.api_configuration.port) throw new Error("SAB_PORT is required and must be a number");
    if (!config.api_configuration.api_key) throw new Error("SAB_API_KEY is required");
    if (config.api_configuration.is_ssl === undefined) throw new Error("SAB_SSL is required and must be 'true' or 'false'");

    if (!config.monitoring_configuration.poll_interval) throw new Error("SAB_POLL_INTERVAL is required and must be a number");
    if (!config.monitoring_configuration.retry_attempts) throw new Error("SAB_RETRY_ATTEMPTS is required and must be a number");
    if (!config.monitoring_configuration.retry_delay) throw new Error("SAB_RETRY_DELAY is required and must be a number");

    if (!config.ui_configuration.ui_refresh_rate) throw new Error("UI_REFRESH_RATE is required and must be a number");
    if (!config.ui_configuration.ui_theme) throw new Error("UI_THEME is required");
}

function parseConfig(): Configuration {
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
            retry_delay: parseInt(process.env.SAB_RETRY_DELAY || '')
        },
        ui_configuration: {
            ui_refresh_rate: parseInt(process.env.UI_REFRESH_RATE || ''),
            ui_theme: process.env.UI_THEME || '',
        },
        queue_item_limit: parseInt(process.env.SAB_ITEM_LIMIT || '5')
    }
}