import { Command, Option } from "commander";
import { customIntParser } from "./config";
import { Constants } from "./constants";

function createHostOptions(): Option[] {
    return [
        new Option('-h, --host <host>', Constants.DESC_HOST)
            .env(Constants.ENV_SAB_HOST),
        new Option('-p, --port <port>', Constants.DESC_PORT)
            .default(Constants.DEFAULT_PORT)
            .env(Constants.ENV_SAB_PORT)
            .argParser(customIntParser),
        new Option('--ssl', Constants.DESC_SSL)
            .default(Constants.DEFAULT_SSL),
        new Option('--api-key <key>', Constants.DESC_API_KEY)
            .env(Constants.ENV_SAB_API_KEY)
    ];
}

function createAPIOptions(): Option[] {
    return [
        new Option('-r, --retries <count>', Constants.DESC_RETRY_ATTEMPTS)
            .default(Constants.DEFAULT_RETRY_ATTEMPTS)
            .env(Constants.ENV_SAB_RETRY_ATTEMPTS)
            .argParser(customIntParser),
        new Option('--retry-delay <delay>', Constants.DESC_RETRY_DELAY)
            .default(Constants.DEFAULT_RETRY_DELAY)
            .env(Constants.ENV_SAB_RETRY_DELAY)
            .argParser(customIntParser)
    ]
}

export function attachCommonOptions(cmd: Command): void {
    createHostOptions().forEach((opt: Option) => cmd.addOption(opt));
    createAPIOptions().forEach((opt: Option) => cmd.addOption(opt));
}
