import { Command, Option } from "commander";
import { SABService } from "../services/sab.service";
import { ConfigHelper } from "../utils/config";
import { ThemeHelper } from "../utils/theme";
import { CommandOptions } from "../utils/command-options";

export function createPollCommand(): Command {
    const cmd = new Command('poll')
        .description('Polls the downloading queue for status updates');

    CommandOptions.createHostOptions().forEach(opt => cmd.addOption(opt));

    return cmd
        .addOption(
            new Option('-l, --limit <type>', 'Set queue item limit')
                .default('15', 'Shows top 15 queue items')
                .env('SAB_ITEM_LIMIT')
                .argParser(ConfigHelper.customIntParser)
        )
        .addOption(
            new Option('-i, --interval <type>', 'Set the polling interval in milliseconds')
                .default('2000', 'Refreshes every 3 seconds')
                .env('SAB_POLL_INTERVAL')
                .argParser(ConfigHelper.customIntParser)
        )
        .addOption(
            new Option('-r, --retries <count>', 'Set retry attempts for API calls')
                .default('3')
                .env('SAB_RETRY_ATTEMPTS')
                .argParser(ConfigHelper.customIntParser)
        )
        .addOption(
            new Option('--retry-delay <delay>', 'Set delay on retry for API calls')
                .default(2000, 'Waits 2000 milliseconds')
                .env('SAB_RETRY_DELAY')
                .argParser(ConfigHelper.customIntParser)
        )
        .addOption(
            new Option('-t, --theme <theme>')
                .choices(ThemeHelper.getAvailableThemeStrings())
                .default(ThemeHelper.defaultThemeString)
                .env('UI_THEME')
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