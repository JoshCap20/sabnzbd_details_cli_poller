#!/usr/bin/env node
import { Command, Option } from "commander";
import { SABService } from "./services/sab.service";
import { ConfigHelper } from "./utils/config";
import { ThemeHelper } from "./utils/theme";

const program = new Command();

program
    .name('SABnzbd CLI Wrapper')
    .description('Simple SABnzbd API wrapper for the CLI')
    .version('0.1.0')

program.command('poll')
    .description('Polls the downloading queue for status updates')
    .addOption(new Option('-l, --limit <type>', 'Set queue item limit'))
    .addOption(new Option('-i, --interval <type>', 'Set the polling interval in milliseconds'))
    .addOption(
        new Option('-t, --theme <theme>')
            .choices(Object.keys(ThemeHelper.stringToThemeMap))
            .default(ThemeHelper.defaultThemeString)
            .env('UI_THEME')
    )
    .action((options) => {
        const service = new SABService(ConfigHelper.getConfig(options));
        process.on('SIGINT', () => {
            service.interrupt();
        });
        service.poll();
    })

program.parse();