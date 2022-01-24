import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidateInputPipe } from './core/pipes/validate.pipe';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {utilities as nestWinstonModuleUtilities, WinstonModule} from "nest-winston";
import * as winston from 'winston';
import * as path from "path";
import {level} from "winston";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
      ),
      transports: [
        new winston.transports.Console({
          level: 'debug',
          format: winston.format.combine(
              // winston.format.colorize({ // I added this but it's still not helping
              //   all: true,
              //   message: false,
              //   level: true,
              // }),
              winston.format.timestamp(),
              winston.format.ms(),
              nestWinstonModuleUtilities.format.nestLike('AppMainModule', { prettyPrint: true}),
          ),
        }),
        new winston.transports.File({
          dirname: path.join(__dirname, './../logs/error/'), //path to where save loggin result
          filename: 'error.log', //name of file where will be saved logging result
          level: 'warn',
        }),
        new winston.transports.File({
          dirname: path.join(__dirname, './../logs/info/'),
          level:'debug',
          filename: 'info.log',
        }),
        new winston.transports.File({
          format: winston.format.combine(
              winston.format.uncolorize({ // I added this but it's still not helping
                message: false,
                level: true,
              }),
              winston.format.label({ label: 'API' }),
              winston.format.timestamp(),
              winston.format.printf(({ level, message, label, timestamp }) => {
                return `${timestamp} [${label}] ${level}: ${message}`;
              }),
          ),
          dirname: path.join(__dirname, './../logs/console/'),
          filename: 'console.log',
          maxsize: 1024 * 1024 * 10,
        }),
      ],
    })
  })
  app.useGlobalPipes(new ValidateInputPipe());
  app.enableCors();
  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('Prometey UI Api')
    .setDescription('Prometey UI Api')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1', app, document);

  await app.listen(process.env.APP_PORT || 3001);
}

bootstrap();
