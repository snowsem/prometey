import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import {
  InjectQueue,
  Processor,
  Process,
  OnQueueCompleted,
  OnQueueFailed,
} from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { _ } from 'lodash';
import {MessageImpl, WebsocketClient} from "../websocket.client";

@Injectable()
@Processor(SendMessageWsProcessor.getQueueName())
export class SendMessageWsProcessor {
  private static queueName = 'sendMessageQueue';
  private readonly logger = new Logger(SendMessageWsProcessor.name);

  public static getQueueName(): string {
    return SendMessageWsProcessor.queueName;
  }

  constructor(
    @InjectQueue(SendMessageWsProcessor.getQueueName())
    private readonly queue: Queue,
    @Inject(WebsocketClient)
    private wsClient: WebsocketClient
  ) {}

  public async add(data) {
    await this.queue.add(data);
  }

  public async sendBroadcast(msg: MessageImpl){
    this.logger.debug('Send Broadcast')
    await this.queue.add('broadcast', msg, { removeOnComplete: true})
  }

  public async sendMessage(msg: MessageImpl){
    this.logger.debug('Send Message')
    await this.queue.add('message', msg, { removeOnComplete: true})
  }

  @Process('broadcast')
  public async handleBroadcast(job: Job<unknown>) {
    await this.wsClient.sendBroadcast(_.get(job, 'data'))
  }

  @Process('message')
  public async handleMessage(job: Job<unknown>) {
    await this.wsClient.sendMessage(_.get(job, 'data'))
  }

  @OnQueueCompleted()
  public success(job: Job, result: any) {
    this.logger.debug(
      `Completed: ${JSON.stringify(job.name)} ${JSON.stringify(job.id)} ${JSON.stringify(result)}`,
    );
  }

  @OnQueueFailed()
  public failed(job: Job, err: Error) {
    this.logger.error(
      `Error Job:${JSON.stringify(job.name)} ${JSON.stringify(job.id)} ${JSON.stringify(job)} ${JSON.stringify(err)}`,
    );
  }
}
