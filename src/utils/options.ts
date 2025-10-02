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
            new Option('-h, --host <host>', Constants.DESC_HOST)
                .env(Constants.ENV_SAB_HOST),
            new Option('-p, --port <port>', Constants.DESC_PORT)
                .default(Constants.DEFAULT_PORT)
                .env(Constants.ENV_SAB_PORT)
                .argParser(ConfigHelper.customIntParser),
            new Option('--ssl', Constants.DESC_SSL)
                .default(Constants.DEFAULT_SSL),
            new Option('--api-key <key>', Constants.DESC_API_KEY)
                .env(Constants.ENV_SAB_API_KEY)
        ];
    }

    private static createAPIOptions(): Option[] {
        return [
            new Option('-r, --retries <count>', Constants.DESC_RETRY_ATTEMPTS)
                .default(Constants.DEFAULT_RETRY_ATTEMPTS)
                .env(Constants.ENV_SAB_RETRY_ATTEMPTS)
                .argParser(ConfigHelper.customIntParser),
            new Option('--retry-delay <delay>', Constants.DESC_RETRY_DELAY)
                .default(Constants.DEFAULT_RETRY_DELAY)
                .env(Constants.ENV_SAB_RETRY_DELAY)
                .argParser(ConfigHelper.customIntParser)
        ]
    }
}
