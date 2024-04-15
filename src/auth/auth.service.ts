import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { SignUpDto } from './dto/sign-up.dto';
import { $Enums, Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';

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

  public async confirmEmail(token: string) {
    const email = await this.decodeToken(token);
    const user = await this.userService.findByEmailOrThrowError(email);

    if (user.status === $Enums.Status.ACTIVE) {
      throw new BadRequestException('User already activated');
    }

    if (user.status === $Enums.Status.PENDING) {
      await this.userService.update(user.id, { status: $Enums.Status.ACTIVE });
    }
    return 'User activated';
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
