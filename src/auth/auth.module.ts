/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/common/schema/user.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { MailingService } from 'src/common/util/mailing/mailing.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, ConfigService, MailingService],
})
export class AuthModule {}
