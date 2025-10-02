import { Command } from "commander";
import { SABService } from "./services/sab.service";
import { ConfigHelper } from "./utils/config";

const program = new Command();

program
    .name('SABnzbd CLI Wrapper')
    .description('Simple SABnzbd API wrapper for the CLI')
    .version('0.1.0')

program.command('poll')
    .description('Polls the downloading queue for status updates')
    .option('-l, --limit <type>', 'Set queue item limit')
    .option('-i, --interval <type>', 'Set the polling interval in miliseconds')
    .action((options) => {
        const service = new SABService(ConfigHelper.getConfig(options));
        process.on('SIGINT', () => {
            service.interrupt();
        });
        service.poll();
    })

program.parse();