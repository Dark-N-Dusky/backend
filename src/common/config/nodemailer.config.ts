/* eslint-disable prettier/prettier */

import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';

export const NodemailerConfig = (configService: ConfigService) => {
  console.log('something');
  return {
    transport: {
      host: configService.get<string>('EMAIL_HOST'),
      port: configService.get<number>('EMAIL_PORT') || 587,
      secure: false,
      auth: {
        user: configService.get<string>('EMAIL_USER'),
        pass: configService.get<string>('EMAIL_PASS'),
      },
    },
    defaults: {
      from: '"DarkNDusky" <contactus@darkanddusky.com>',
    },
    template: {
      dir: path.join(__dirname, '..', 'emailTemplate'),
      adapter: new PugAdapter(),
      options: {
        strict: true,
      },
    },
  };
};
