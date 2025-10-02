import { Command, Option } from "commander";
import { SABService } from "../services/sab.service";
import { ConfigHelper } from "../utils/config";
import { ThemeHelper } from "../utils/theme";

export function createPollCommand(): Command {
    return new Command('poll')
        .description('Polls the downloading queue for status updates')
        .addOption(
            new Option('-h, --host <host>', 'Set host address (e.g. 192.168.1.71)')
                .env('SAB_HOST')
        )
        .addOption(
            new Option('-p, --port <port>', 'Set port number (e.g. 8080)')
                .default('8080')
                .env('SAB_PORT')
                .argParser(ConfigHelper.customIntParser)
        )
        .addOption(
            new Option('--ssl', 'Uses HTTPS protocol for connection')
                .default(false)
        )
        .addOption(
            new Option('--api-key <key>', 'Set API key (retrieved from sabnzbd')
                .env('SAB_API_KEY')
        )
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
