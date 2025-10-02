import { Command, Option } from "commander";
import { ConfigHelper } from "./config";
import { Constants } from "./constants";

export class OptionsHelper {
    public static attachCommonOptions(cmd: Command) {
        OptionsHelper.createHostOptions().forEach((opt: Option) => cmd.addOption(opt));
        OptionsHelper.createAPIOptions().forEach((opt: Option) => cmd.addOption(opt));
    }

    private static createHostOptions(): Option[] {
        return [
            new Option('-h, --host <host>', 'Set host address (e.g. 192.168.1.71)')
                .env(Constants.ENV_SAB_HOST),
            new Option('-p, --port <port>', 'Set port number (e.g. 8080)')
                .default(Constants.DEFAULT_PORT)
                .env(Constants.ENV_SAB_PORT)
                .argParser(ConfigHelper.customIntParser),
            new Option('--ssl', 'Uses HTTPS protocol for connection')
                .default(Constants.DEFAULT_SSL),
            new Option('--api-key <key>', 'Set API key (retrieved from sabnzbd')
                .env(Constants.ENV_SAB_API_KEY)
        ];
    }

    private static createAPIOptions(): Option[] {
        return [
            new Option('-r, --retries <count>', 'Set retry attempts for API calls')
                .default(Constants.DEFAULT_RETRY_ATTEMPTS)
                .env(Constants.ENV_SAB_RETRY_ATTEMPTS)
                .argParser(ConfigHelper.customIntParser),
            new Option('--retry-delay <delay>', 'Set delay on retry for API calls')
                .default(Constants.DEFAULT_RETRY_DELAY, Constants.DESC_DEFAULT_RETRY_DELAY)
                .env(Constants.ENV_SAB_RETRY_DELAY)
                .argParser(ConfigHelper.customIntParser)
        ]
    }
}
