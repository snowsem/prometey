import { Module } from '@nestjs/common';
import { VirtualEnvService } from './services/virtual-env.service';
import { VirtualEnvController } from './controllers/virtual-env.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {VirtualEnv} from "./entity/virtual-env.entity";
import {VirtualEnvService as VirtualEnvServiceEntity} from "./entity/virtual-env-service.entity";
import {User} from "./entity/user.entity";
import {GithubModule} from "../github/github.module";

@Module({
  imports: [
      GithubModule,
      TypeOrmModule.forFeature([VirtualEnv, VirtualEnvServiceEntity, User]),

  ],
  providers: [VirtualEnvService],
  exports: [VirtualEnvService],
  controllers: [VirtualEnvController]
})

export class VirtualEnvModule {}
