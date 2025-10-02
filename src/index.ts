import { SABService } from "./services/sab.service";

const service = new SABService();

process.on('SIGINT', () => {
    service.interrupt();
});

service.poll();