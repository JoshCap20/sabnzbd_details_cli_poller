import { Option } from "commander";
import { ConfigHelper } from "./config";

export class CommandOptions {
    static createHostOptions(): Option[] {
        return [
            new Option('-h, --host <host>', 'Set host address (e.g. 192.168.1.71)')
                .env('SAB_HOST'),
            new Option('-p, --port <port>', 'Set port number (e.g. 8080)')
                .default('8080')
                .env('SAB_PORT')
                .argParser(ConfigHelper.customIntParser),
            new Option('--ssl', 'Uses HTTPS protocol for connection')
                .default(false),
            new Option('--api-key <key>', 'Set API key (retrieved from sabnzbd')
                .env('SAB_API_KEY')
        ];
    }
}
