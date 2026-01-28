/* eslint-disable prettier/prettier */
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailingService {
  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeMail(to: string, name: string): Promise<void> {
    await this.mailerService.sendMail({
      to,
      subject: 'Welcome to Dark&Dusky family!',
      template: 'welcome',
      context: {
        name,
      },
    });
  }

  async sendPasswordResetMail(
    to: string,
    token: string,
    name: string,
  ): Promise<void> {
    const resetUrl = `https://darkanddusky.com/forgot-password/reset/${token}`;

    await this.mailerService.sendMail({
      to,
      subject: 'Passowrd reset - Dark&Dusky',
      template: 'password',
      context: {
        name,
        resetUrl,
      },
    });
  }
}
