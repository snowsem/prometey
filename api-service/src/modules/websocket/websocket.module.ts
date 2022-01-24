import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { SendMessageWsProcessor } from './processors/send-message-ws.processor';
import { BullModule } from '@nestjs/bull';
import {WebsocketClient} from "./websocket.client";
@Module({
  imports: [
      BullModule.registerQueue({
      name: SendMessageWsProcessor.getQueueName(),
    }),
  ],
  exports: [WebsocketClient, SendMessageWsProcessor],
  providers: [WebsocketGateway, SendMessageWsProcessor, WebsocketClient],
})
export class WebsocketModule {}
