import { Module } from '@nestjs/common';
import { VirtualEnvService } from './virtual-env.service';
import { VirtualEnvController } from './virtual-env.controller';

@Module({

  providers: [VirtualEnvService],
  exports: [VirtualEnvService],
  controllers: [VirtualEnvController]
})
export class VirtualEnvModule {}
