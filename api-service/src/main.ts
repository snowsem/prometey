import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidateInputPipe } from './core/pipes/validate.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidateInputPipe());
  app.setGlobalPrefix('api/v1');
  await app.listen(process.env.APP_PORT || 3001);
}

bootstrap();
