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
  ) {}

  public async add(data) {
    await this.queue.add(data);
  }

  @Process()
  public async send(job: Job<unknown>) {}

  @OnQueueCompleted()
  public success(job: Job, result: any) {
    this.logger.debug(
      `Completed: ${JSON.stringify(job)} ${JSON.stringify(result)}`,
    );
  }

  @OnQueueFailed()
  public failed(job: Job, err: Error) {
    this.logger.error(
      `Error Job: ${JSON.stringify(job)} ${JSON.stringify(err)}`,
    );
  }
}
