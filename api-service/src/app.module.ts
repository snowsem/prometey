import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VirtualEnvModule } from './virtual-env/virtual-env.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule} from "@nestjs/config";
import {typeOrmConfig} from "./configs";

@Module({
  imports: [
      ConfigModule.forRoot({ isGlobal: true }),
      VirtualEnvModule,
      TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          logging: true,
          entities: ["dist/**/*.entity{.ts,.js}"],
          migrations: [
              "database/migrations/**/*.js"
          ],
          subscribers: [
              "src/subscriber/**/*.ts"
          ],
          cli: {
              "entitiesDir": "src/entity",
              "migrationsDir": "database/migrations",
              "subscribersDir": "src/subscriber"
          }
      })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
