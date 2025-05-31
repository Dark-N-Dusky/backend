/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({});
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.use(
    ['/documentation/api'],
    basicAuth({
      users: { root: process.env.SWAGGER_PASSWORD || '' },
      challenge: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Dark & Dusky')
    .setDescription('Dark & Dusky API Documentation')
    .setVersion('1.0')
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('documentation/api', app, documentFactory);

  await app.listen(process.env.BACKEND_PORT ?? 3000);

  console.log(`Server is running on port ${process.env.BACKEND_PORT ?? 3000}`);
  console.log('!!!Server ready!!!');
  console.log('Have fun :)');
}

void bootstrap();
