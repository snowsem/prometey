import {Module} from '@nestjs/common';
import {NestFactory} from "@nestjs/core";
import {BullModule} from "@nestjs/bull";
import {SendMessageWsProcessor} from "../websocket/processors/send-message-ws.processor";

@Module({
    imports: [
        BullModule.forRoot({
        redis: {
            host: process.env.REDIS_HOST || 'localhost',
            port: 6379,
        },}),
        BullModule.registerQueue({
            name: SendMessageWsProcessor.getQueueName(),
        }),
    ],
    exports:[SendMessageWsProcessor,],
    providers: [SendMessageWsProcessor,]
})
export class QueueModule {
}

async function bootstrap() {
    const app = await NestFactory.create(QueueModule);
    await app.init();
}