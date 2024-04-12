import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { $Enums } from '@prisma/client';

@Injectable()
export class JwtRoleGuard extends AuthGuard('jwt') {
  private requiredRole: $Enums.Role[];
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    const requiredRole = this.reflector.get<$Enums.Role[]>(
      'role',
      context.getHandler(),
    );
    this.requiredRole = requiredRole;
    return super.canActivate(context);
  }
  handleRequest(_err, user) {
    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }
    const isAllowed = this.requiredRole.some((role) => role === user.role);
    if (isAllowed) {
      return user;
    }
    throw new UnauthorizedException('Invalid permissions');
  }
}
