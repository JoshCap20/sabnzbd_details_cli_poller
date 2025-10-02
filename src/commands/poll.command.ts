import { Command, Option } from "commander";
import { SABService } from "../services/sab.service";
import { ConfigHelper } from "../utils/config";
import { ThemeHelper } from "../utils/theme";
import { OptionsHelper } from "../utils/options";
import { Constants } from "../utils/constants";

export function createPollCommand(): Command {
    const cmd = new Command('poll')
        .description('Polls the downloading queue for status updates');

    OptionsHelper.attachCommonOptions(cmd);

    return cmd
        .addOption(
            new Option('-l, --limit <type>', 'Set queue item limit')
                .default(Constants.DEFAULT_QUEUE_LIMIT, Constants.DESC_DEFAULT_QUEUE_LIMIT)
                .env(Constants.ENV_SAB_ITEM_LIMIT)
                .argParser(ConfigHelper.customIntParser)
        )
        .addOption(
            new Option('-i, --interval <type>', 'Set the polling interval in milliseconds')
                .default(Constants.DEFAULT_POLL_INTERVAL, Constants.DESC_DEFAULT_POLL_INTERVAL)
                .env(Constants.ENV_SAB_POLL_INTERVAL)
                .argParser(ConfigHelper.customIntParser)
        )
        .addOption(
            new Option('-t, --theme <theme>')
                .choices(ThemeHelper.getAvailableThemeStrings())
                .default(ThemeHelper.defaultThemeString)
                .env(Constants.ENV_UI_THEME)
        )
        .action((options) => {
            console.log(options);
            console.log('\n\n');
            const service = new SABService(ConfigHelper.getConfig(options));
            process.on('SIGINT', () => {
                service.interrupt();
            });
            service.poll();
        });
}