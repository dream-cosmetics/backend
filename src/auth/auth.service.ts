import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { SignUpDto } from './dto/sign-up.dto';
import { $Enums, Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async signUp(signUpDto: SignUpDto) {
    const user = await this.userService.create(signUpDto);
    return this.generateToken(user);
  }

  async login(email: string, password: string) {
    const user = await this.userService.findByEmailOrThrowError(email);
    await this.userService.validateUser(email, password);
    return this.generateToken(user);
  }

  async getUserInfo(id: number) {
    return this.userService.findOne(id);
  }

  private async generateConfirmEmail(user: SignUpDto, token: string) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const url = `${frontendUrl}/auth/confirm-email?token=${token}`;
    console.log(url);

    //TODO: add email service to send email to user
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
