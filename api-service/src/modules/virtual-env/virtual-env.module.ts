import { Module } from '@nestjs/common';
import { VenvService} from './services/venv.service';
import { VirtualEnvController } from './controllers/virtual-env.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {VirtualEnv} from "./entity/virtual-env.entity";
import {VirtualEnvService} from "./entity/virtual-env-service.entity";
import {User} from "./entity/user.entity";
import {GithubModule} from "../github/github.module";
import {MicroInfraService} from "./entity/micro-infra-service.entity";

@Module({
  imports: [
      GithubModule,
      TypeOrmModule.forFeature([VirtualEnv, VirtualEnvService, MicroInfraService, User]),

  ],
  providers: [VenvService],
  exports: [VenvService],
  controllers: [VirtualEnvController]
})

export class VirtualEnvModule {}
