/* eslint-disable prettier/prettier */
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

export const PostgreSQLConfig = (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => {
  const isTesting = configService.get<string>('NODE_ENV') === 'test';

  const config: TypeOrmModuleOptions = {
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: parseInt(configService.get<string>('DB_PORT') || '5432', 10),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_DATABASE'),
    entities: [path.join(__dirname, '../../', '**', '*.entity{.ts,.js}')],
    synchronize: configService.get<string>('NODE_ENV') !== 'production',
    logging: configService.get<string>('NODE_ENV') !== 'production',
    ssl:
      isTesting || configService.get<string>('DB_SSL') === 'true'
        ? { rejectUnauthorized: false }
        : undefined,
  };

  return Promise.resolve(config);
};

// /* eslint-disable prettier/prettier */
// import 'reflect-metadata';
// import * as dotenv from 'dotenv';
// import { TypeOrmModuleOptions } from '@nestjs/typeorm';
// import { ConfigService } from '@nestjs/config';
// import { DataSource, DataSourceOptions } from 'typeorm';
// import * as path from 'path';

// dotenv.config();

// const buildPostgresOptions = (
//   getEnv: (key: string) => string | undefined,
// ): TypeOrmModuleOptions => {
//   const nodeEnv = getEnv('NODE_ENV');
//   const isTesting = nodeEnv === 'test';
//   const isProduction = nodeEnv === 'production';

//   return {
//     type: 'postgres',
//     host: getEnv('DB_HOST'),
//     port: parseInt(getEnv('DB_PORT') || '5432', 10),
//     username: getEnv('DB_USERNAME'),
//     password: getEnv('DB_PASSWORD'),
//     database: getEnv('DB_DATABASE'),
//     entities: [path.join(__dirname, '../../', '**', '*.entity{.ts,.js}')],
//     migrations: [path.join(__dirname, '../../', 'migrations', '*{.ts,.js}')],
//     synchronize: !isProduction,
//     logging: !isProduction,
//     ssl:
//       isTesting || getEnv('DB_SSL') === 'true'
//         ? { rejectUnauthorized: false }
//         : undefined,
//   };
// };

// export const PostgreSQLConfig = (
//   configService: ConfigService,
// ): Promise<TypeOrmModuleOptions> => {
//   const config = buildPostgresOptions((key) =>
//     configService.get<string>(key),
//   );

//   return Promise.resolve(config);
// };

// export const AppDataSource = new DataSource(
//   buildPostgresOptions((key) => process.env[key]) as DataSourceOptions,
// );
