import { Injectable } from '@nestjs/common';
import { courier } from './mail.api';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(private readonly configService: ConfigService) {}

  async sendUserConfirmationEmail(email: string, name: string, token: string) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const url = `${frontendUrl}/auth/confirm-email?token=${token}`;

    try {
      await courier.send({
        message: {
          content: {
            title: 'Subscribe to DreamCosmetics',
            body: 'Hey {{user}}, glad you signed up. Here is your confirmation link, you must click it to activate your account.',
            version: '2024-04-16',
            elements: [
              {
                type: 'action',
                style: 'button',
                content: 'Activate',
                href: '{{url}}',
              },
            ],
          },
          data: {
            user: name,
            url: url,
          },
          to: {
            email: email,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async sendPasswordResetEmail(email: string, name: string, token: string) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const url = `${frontendUrl}/auth/reset-password?token=${token}`;
    try {
      await courier.send({
        message: {
          content: {
            title: 'Reset password for DreamCosmetics',
            body: 'Hey {{user}}, you requested a password reset. Here is your reset link, you must click it to reset your password.',
            version: '2024-04-16',
            elements: [
              {
                type: 'action',
                style: 'button',
                content: 'Reset Password',
                href: '{{url}}',
              },
            ],
          },
          data: {
            user: name,
            url: url,
          },
          to: {
            email: email,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
}
