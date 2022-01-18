import { forwardRef, Module } from '@nestjs/common';
import { MicroInfraApiService } from './services/micro-infra-api.service';
import { MicroInfraRepoService } from './services/micro-infra-repo.service';
import { GithubController } from './controllers/github.controller';
import { GithubService } from './services/github.service';
import { VenvService } from '../virtual-env/services/venv.service';
import { VirtualEnvModule } from '../virtual-env/virtual-env.module';
import {WebsocketModule} from "../websocket/websocket.module";

@Module({
  imports: [
      forwardRef(() => VirtualEnvModule),
      WebsocketModule,
  ],

  exports: [MicroInfraApiService, MicroInfraRepoService, GithubService],
  providers: [MicroInfraApiService, MicroInfraRepoService, GithubService],
  controllers: [GithubController],
})
export class GithubModule {}
