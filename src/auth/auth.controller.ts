import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignUpDto } from './dto/sign-up.dto';
import { LoginDto } from './dto/login.dto';
import { TokenDto } from './dto/token.dto';
import { GetUser } from './decorators/get-user.decorator';
import Roles from './decorators/role.decorator';
import { JwtRoleGuard } from './guards/jwt-role.guard';
import { User } from '@prisma/client';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiBody({
    type: SignUpDto,
  })
  @Post('/signup')
  signup(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @ApiResponse({
    status: 200,
    description: 'The user has successfully logged in.',
  })
  @ApiBody({
    type: LoginDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @ApiResponse({
    status: 200,
    description: 'The user has successfully activated.',
  })
  @ApiBody({
    type: TokenDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('/activate')
  validate(@Body() tokenDto: TokenDto) {
    return this.authService.confirmEmail(tokenDto.token);
  }

  @ApiResponse({
    status: 200,
    description: 'User info',
  })
  @ApiBearerAuth()
  @UseGuards(JwtRoleGuard)
  @Roles(['ADMIN', 'USER'])
  @Get('/me')
  getUserInfo(@GetUser() user: User) {
    return this.authService.getUserInfo(user.id);
  }
}
