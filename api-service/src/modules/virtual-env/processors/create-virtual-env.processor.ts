import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue, Processor, Process } from '@nestjs/bull';
import { Job, Queue } from 'bull';

@Injectable()
@Processor(CreateVirtualEnvProcessor.getQueueName())
export class CreateVirtualEnvProcessor {
  private static queueName = 'virtualEnvQueue';
  private readonly logger = new Logger(CreateVirtualEnvProcessor.name);

  public static getQueueName(): string {
    return CreateVirtualEnvProcessor.queueName;
  }

  constructor(
    @InjectQueue(CreateVirtualEnvProcessor.getQueueName())
    private readonly queue: Queue,
  ) {}

  public async add(data) {
    await this.queue.add(data);
  }

  @Process('create')
  public async createVirtualEnv(job: Job<unknown>) {
    this.logger.debug(JSON.stringify(job));
  }

  @Process('update')
  public async updateVirtualEnv(job: Job<unknown>) {
    this.logger.debug(JSON.stringify(job));
  }

  @Process('delete')
  public async deleteVirtualEnv(job: Job<unknown>) {
    this.logger.debug(JSON.stringify(job));
  }
}
