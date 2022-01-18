import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import {
  InjectQueue,
  Processor,
  Process,
  OnQueueCompleted,
  OnQueueFailed,
} from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { GithubService } from '../../github/services/github.service';
import { VenvService } from '../services/venv.service';
import { _ } from 'lodash';

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

    @Inject(GithubService)
    private readonly githubService: GithubService,

    @Inject(forwardRef(() => VenvService))
    private readonly venvService: VenvService,
  ) {}

  public async add(data) {
    await this.queue.add(data);
  }

  @Process('create')
  public async createVirtualEnv(job: Job<unknown>) {
    const venv = await this.venvService.findById(_.get(job, 'data', null));
    return await this.githubService.createBranch([venv]);
  }

  @Process('update')
  public async updateVirtualEnv(job: Job<unknown>) {
    const venv = await this.venvService.findById(_.get(job, 'data', null));
    return await this.githubService.createBranch([venv]);
  }

  @Process('delete')
  public async deleteVirtualEnv(job: Job<unknown>) {
    const venv = await this.venvService.findById(_.get(job, 'data', null));
    await this.githubService.deleteEnv([venv]);
    this.logger.debug(JSON.stringify(job));
  }

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
