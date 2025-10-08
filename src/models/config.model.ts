export interface APIConfiguration {
    host: string
    port: number
    api_key: string
    is_ssl: boolean
}

export interface UIConfiguration {
    theme: string
}

export interface MonitoringConfiguration {
    poll_interval: number
    retry_attempts: number
    retry_delay: number
    queue_item_limit: number
}

export interface Configuration {
    api_configuration: APIConfiguration
    monitoring_configuration: MonitoringConfiguration
    ui_configuration: UIConfiguration
}
