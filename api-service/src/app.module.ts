import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VirtualEnvModule } from './virtual-env/virtual-env.module';

@Module({
  imports: [VirtualEnvModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
