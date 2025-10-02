export interface APIConfiguration {
    host: string,
    port: number,
    api_key: string,
    is_ssl: boolean,
}

export interface UIConfiguration {
    ui_refresh_rate: number,
    ui_theme: string
}

export interface MonitoringConfiguration {
    poll_interval: number,
    retry_attempts: number,
    retry_delay: number,
}

export interface Configuration {
    api_configuration: APIConfiguration,
    monitoring_configuration: MonitoringConfiguration,
    ui_configuration: UIConfiguration
    // lazy
    queue_item_limit?: number
}
