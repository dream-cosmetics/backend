import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { SignUpDto } from './dto/sign-up.dto';
import { $Enums, Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}
  async signUp(signUpDto: SignUpDto) {
    const user = await this.userService.create(signUpDto);
    const token = await this.generateToken(user);
    await this.mailService.sendUserConfirmationEmail(
      user.email,
      user.firstName,
      token.access_token,
    );
    return token;
  }

  async login(email: string, password: string) {
    const user = await this.userService.findByEmailOrThrowError(email);
    await this.userService.validateUser(email, password);
    return this.generateToken(user);
  }

  async getUserInfo(id: number) {
    return this.userService.findOne(id);
  }

  async confirmEmail(token: string) {
    const email = await this.decodeToken(token);
    const user = await this.userService.findByEmailOrThrowError(email);

    if (user.status === $Enums.Status.ACTIVE) {
      throw new BadRequestException('User already activated');
    }

    if (user.status === $Enums.Status.PENDING) {
      await this.userService.update(user.id, { status: $Enums.Status.ACTIVE });
    }
    return { message: 'User activated' };
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findByEmailOrThrowError(email);
    const token = await this.generateToken(user);
    await this.mailService.sendPasswordResetEmail(
      user.email,
      user.firstName,
      token.access_token,
    );
    return {
      message: 'Password reset email sent',
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const userEmail = await this.decodeToken(resetPasswordDto.token);
    const user = await this.userService.findByEmailOrThrowError(userEmail);

    await this.userService.update(user.id, {
      password: await this.userService.hashPassword(resetPasswordDto.password),
    });
    return { message: 'Password reset' };
  }

  private async generateToken(
    user: Prisma.UserGetPayload<{ select: { id: true; email: true } }>,
  ) {
    const payload = {
      id: user.id,
      email: user.email,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  private async decodeToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      if (typeof payload === 'object' && payload.hasOwnProperty('email')) {
        return payload.email;
      }
      throw new Error('Invalid token');
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }
}
