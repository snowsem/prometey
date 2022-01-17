import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidateInputPipe } from './core/pipes/validate.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidateInputPipe());
  await app.listen(3001);

  //app.setGlobalPrefix('api/v1');
  // handle all user input validation globally
}
bootstrap();
