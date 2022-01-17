import { Module } from '@nestjs/common';
import { VirtualEnvService } from './virtual-env.service';
import { VirtualEnvController } from './virtual-env.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {VirtualEnv} from "./entity/virtual-env.entity";
import {VirtualEnvService as VirtualEnvServiceEntity} from "./entity/virtual-env-service.entity";

@Module({
  imports: [TypeOrmModule.forFeature([VirtualEnv, VirtualEnvServiceEntity])],
  providers: [VirtualEnvService],
  exports: [VirtualEnvService],
  controllers: [VirtualEnvController]
})
export class VirtualEnvModule {}
