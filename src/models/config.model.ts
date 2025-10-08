export interface APIConfiguration {
    host: string
    port: number
    apiKey: string
    isSSL: boolean
}

export interface UIConfiguration {
    theme: string
    maxTitleLength: number
    barSize: number
    isColoredStatus: boolean
}

export interface QueuePollingConfiguration {
    pollingInterval: number
    retryAttempts: number
    retryDelay: number
    queueItemLimit: number
}

export interface Configuration {
    apiConfig: APIConfiguration
    queuePollingConfig: QueuePollingConfiguration
    uiConfig: UIConfiguration
}
