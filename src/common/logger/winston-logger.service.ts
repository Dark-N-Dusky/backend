import { LoggerService } from '@nestjs/common';
import { Logger } from 'winston';

type LogMetadata = Record<string, unknown>;

export class WinstonLoggerService implements LoggerService {
  constructor(private readonly logger: Logger) {}

  log(message: unknown, ...optionalParams: unknown[]) {
    this.logger.info(
      this.stringify(message),
      this.extractMetadata(optionalParams),
    );
  }

  error(message: unknown, ...optionalParams: unknown[]) {
    this.logger.error(
      this.stringify(message),
      this.extractMetadata(optionalParams),
    );
  }

  warn(message: unknown, ...optionalParams: unknown[]) {
    this.logger.warn(
      this.stringify(message),
      this.extractMetadata(optionalParams),
    );
  }

  debug(message: unknown, ...optionalParams: unknown[]) {
    this.logger.debug(
      this.stringify(message),
      this.extractMetadata(optionalParams),
    );
  }

  verbose(message: unknown, ...optionalParams: unknown[]) {
    this.logger.verbose(
      this.stringify(message),
      this.extractMetadata(optionalParams),
    );
  }

  fatal(message: unknown, ...optionalParams: unknown[]) {
    this.logger.error(
      this.stringify(message),
      this.extractMetadata(optionalParams),
    );
  }

  private stringify(message: unknown): string {
    if (typeof message === 'string') {
      return message;
    }

    if (message instanceof Error) {
      return message.message;
    }

    try {
      return JSON.stringify(message);
    } catch {
      return '[Unserializable log payload]';
    }
  }

  private extractMetadata(optionalParams: unknown[]): LogMetadata {
    if (optionalParams.length === 0) {
      return {};
    }

    if (optionalParams.length === 1) {
      return this.toMetadata(optionalParams[0], 'context');
    }

    const [trace, context, ...extra] = optionalParams;
    const metadata: LogMetadata = {
      ...this.toMetadata(context, 'context'),
      ...this.toMetadata(trace, 'trace'),
    };

    if (extra.length > 0) {
      metadata.extra = extra;
    }

    return metadata;
  }

  private toMetadata(value: unknown, key: string): LogMetadata {
    if (value === undefined || value === null) {
      return {};
    }

    if (typeof value === 'string') {
      return { [key]: value };
    }

    if (value instanceof Error) {
      return {
        [key]: value.message,
        stack: value.stack,
      };
    }

    if (typeof value === 'object') {
      return value as LogMetadata;
    }

    return { [key]: value };
  }
}
