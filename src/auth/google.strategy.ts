/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  Strategy,
  VerifyCallback,
  StrategyOptions,
  Profile,
} from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService) {
    super({
      // 1. Ensure these are strings, not 'string | undefined'
      clientID: configService.get<string>('GOOGLE_CLIENT_ID') || '',
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') || '',
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL') || '',
      scope: ['email', 'profile'],
    } as StrategyOptions); // 2. Explicitly cast to StrategyOptions
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos, id } = profile;

    const user = {
      email: emails?.[0]?.value,
      name: name ? `${name.givenName} ${name.familyName}` : 'No Name',
      picture: photos?.[0]?.value,
      googleId: id,
    };

    done(null, user);
    return Promise.resolve(user); // Ensure a value is returned
  }
}
