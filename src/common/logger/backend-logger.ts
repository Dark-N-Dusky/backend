import { mkdirSync } from 'fs';
import { join } from 'path';
import { createLogger, format, transports } from 'winston';

const PROJECT_ROOT = join(__dirname, '..', '..', '..');
const LOG_DIRECTORY = join(PROJECT_ROOT, 'logs');
const BACKEND_LOG_LEVEL = process.env.BACKEND_LOG_LEVEL ?? 'verbose';
const MAX_LOG_FILE_SIZE_BYTES = Number(
  process.env.BACKEND_LOG_MAX_SIZE_BYTES ?? 5 * 1024 * 1024,
);
const MAX_LOG_FILES = Number(process.env.BACKEND_LOG_MAX_FILES ?? 7);

mkdirSync(LOG_DIRECTORY, { recursive: true });

const logFormat = format.combine(
  format.timestamp({
    format: () => new Date().toISOString(),
  }),
  format.errors({ stack: true }),
  format.printf(({ timestamp, level, message, stack, ...meta }) => {
    const output = stack ?? message;
    const metadata =
      Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';

    return `[${String(timestamp)}] [${String(level).toUpperCase()}] ${String(output)}${metadata}`;
  }),
);

export const backendLogger = createLogger({
  level: BACKEND_LOG_LEVEL,
  format: logFormat,
  transports: [
    new transports.File({
      filename: join(LOG_DIRECTORY, 'backend.log'),
      level: 'verbose',
      maxsize: MAX_LOG_FILE_SIZE_BYTES,
      maxFiles: MAX_LOG_FILES,
      tailable: true,
    }),
    new transports.File({
      filename: join(LOG_DIRECTORY, 'backend-error.log'),
      level: 'error',
      maxsize: MAX_LOG_FILE_SIZE_BYTES,
      maxFiles: MAX_LOG_FILES,
      tailable: true,
    }),
  ],
});
