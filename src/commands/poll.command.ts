import { Command, Option } from "commander";

import { SABService } from "../services/sab.service";
import { customIntParser, getConfig } from "../utils/config";
import { defaultThemeString, getAvailableThemeStrings } from "../utils/theme";
import { attachCommonOptions } from "../utils/options";
import { Constants } from "../utils/constants";

export function createPollCommand(): Command {
    const cmd = new Command('poll')
        .description('Polls the downloading queue for status updates');

    attachCommonOptions(cmd);

    return cmd
        .addOption(
            new Option('-l, --limit <limit>', Constants.DESC_QUEUE_LIMIT)
                .default(Constants.DEFAULT_QUEUE_LIMIT)
                .env(Constants.ENV_SAB_ITEM_LIMIT)
                .argParser(customIntParser)
        )
        .addOption(
            new Option('-i, --interval <interval>', Constants.DESC_POLL_INTERVAL)
                .default(Constants.DEFAULT_POLL_INTERVAL)
                .env(Constants.ENV_SAB_POLL_INTERVAL)
                .argParser(customIntParser)
        )
        .addOption(
            new Option('-t, --theme <theme>', Constants.DESC_THEME)
                .choices(getAvailableThemeStrings())
                .default(defaultThemeString)
                .env(Constants.ENV_UI_THEME)
        )
        .addOption(
            new Option('--title-length <length>', Constants.DESC_MAX_TITLE_LENGTH)
                .default(Constants.DEFAULT_MAX_TITLE_LENGTH)
                .env(Constants.ENV_MAX_TITLE_LENGTH)
                .argParser(customIntParser)
        )
        .addOption(
            new Option('--bar-size <size>', 'Set the size of the progress bar')
                .default(20)
                .argParser(customIntParser)
        )
        .action((options) => {
            console.log(options);
            console.log('\n\n');
            const service = new SABService(getConfig(options));
            process.on('SIGINT', () => {
                service.interrupt();
            });
            service.poll();
        });
}