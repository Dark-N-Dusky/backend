/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT Secret not present');
    }

    super({
      jwtFromRequest: (req: Request) => {
        let token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

        if (!token) {
          token = ExtractJwt.fromExtractors([
            (req: Request) => {
              const cookies = req.cookies as {
                [key: string]: string | undefined;
              };
              return cookies['token'] || null;
            },
          ])(req);
        }
        console.log(token);
        return token;
      },
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  validate(payload: { uid: string }) {
    if (!payload.uid) {
      throw new UnauthorizedException('Invalid token payload');
    }
    console.log('Validated', payload.uid);

    return { uid: payload.uid };
  }
}
