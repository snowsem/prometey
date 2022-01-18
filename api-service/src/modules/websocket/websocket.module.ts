import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { SendMessageWsProcessor } from './processors/send-message-ws.processor';
import { BullModule } from '@nestjs/bull';
@Module({
  imports: [
    BullModule.registerQueue({
      name: SendMessageWsProcessor.getQueueName(),
    }),
  ],
  exports: [],
  providers: [WebsocketGateway, SendMessageWsProcessor],
})
export class WebsocketModule {}
