import { Module } from '@nestjs/common';
import {MicroInfraApiService} from "./services/micro-infra-api.service";
import {MicroInfraRepoService} from "./services/micro-infra-repo.service";
import { GithubController } from './controllers/github.controller';

@Module({
  imports: [],
  exports: [MicroInfraApiService, MicroInfraRepoService],
  providers: [MicroInfraApiService, MicroInfraRepoService],
  controllers: [GithubController]
})

export class GithubModule {}
