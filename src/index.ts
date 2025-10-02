import { Command } from "commander";
import { SABService } from "./services/sab.service";
import { ConfigHelper } from "./utils/config";

const program = new Command();

program
    .name('SABnzbd CLI Util')
    .description('Simple API wrapper for the CLI')
    .version('0.1.0')
    .option('-l, --limit <type>', 'Set queue item limit')
    .option('-i, --interval <type>', 'Set the polling interval in miliseconds')
    .parse();

const options = program.opts();
const config = ConfigHelper.getConfig();

// Override environment vars with cli if set
if (options.limit) {
    config.monitoring_configuration.queue_item_limit = ConfigHelper.parseStringAsInteger("limit", options.limit);
}
if (options.interval) {
    config.monitoring_configuration.poll_interval = ConfigHelper.parseStringAsInteger("interval", options.interval);
}

const service = new SABService(config);

process.on('SIGINT', () => {
    service.interrupt();
});

service.poll();