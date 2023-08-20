import { NestFactory } from '@nestjs/core';
import { ReservationsModule } from './reservations.module';
import {Logger} from 'nestjs-pino'
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(ReservationsModule);
  app.enableCors({
      origin: 'http://localhost:3000',
      credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({whitelist: true}));
  app.useLogger(app.get(Logger));
  app.use(cookieParser());
  const configService = app.get(ConfigService);
  await app.listen(configService.get('PORT'));
}
bootstrap();
