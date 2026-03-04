/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';
import { NextFunction, Request, Response } from 'express';
import { backendLogger } from './common/logger/backend-logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.use((req: Request, res: Response, next: NextFunction) => {
    const startedAt = process.hrtime.bigint();

    backendLogger.verbose('Incoming backend request', {
      method: req.method,
      path: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('user-agent') ?? 'unknown',
    });

    res.on('finish', () => {
      const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
      const logLevel =
        res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'verbose';

      backendLogger.log({
        level: logLevel,
        message: 'Backend request completed',
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        durationMs: Number(durationMs.toFixed(2)),
      });
    });

    next();
  });

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

  const port = Number(process.env.BACKEND_PORT ?? 3000);
  await app.listen(port);

  logger.log(`Server is running on port ${port}`);
  logger.log('Backend server ready');
}

void bootstrap();
