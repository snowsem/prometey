import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VirtualEnvModule } from './modules/virtual-env/virtual-env.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './modules/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { WebsocketModule } from './modules/websocket/websocket.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    VirtualEnvModule,
    PassportModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      logging: false,
      autoLoadEntities: true,
      synchronize: true,
      entities: ['dist/**/*.entity{.ts,.js}'],
      migrations: ['database/migrations/**/*.js'],
      subscribers: ['src/subscriber/**/*.ts'],
      cli: {
        entitiesDir: 'src/entity',
        migrationsDir: 'database/migrations',
        subscribersDir: 'src/subscriber',
      },
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: 6379,
      },
      defaultJobOptions: {
        removeOnComplete: true,
        attempts: 5,
        backoff: 60000
      }
    }),
    AuthModule,
    WebsocketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
