/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostgreSQLConfig } from './common/config/pg.config';
import { MongooseConfig } from './common/config/mongo.config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { AdminModule } from './admin/admin.module';
import { ReturnModule } from './return/return.module';
import { GraphQLConfig } from './common/config/graphql.config';
import { OrderModule } from './order/order.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CartModule } from './cart/cart.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { NodemailerConfig } from './common/config/nodemailer.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) =>
        PostgreSQLConfig(configService),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) =>
        MongooseConfig(configService),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) =>
        NodemailerConfig(configService),
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>(GraphQLConfig),
    AuthModule,
    UserModule,
    ProductModule,
    AdminModule,
    ReturnModule,
    OrderModule,
    CartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
