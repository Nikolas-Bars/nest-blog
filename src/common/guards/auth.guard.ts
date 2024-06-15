import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from '../../features/users/application/users.service';
import { AuthService } from '../../features/auth/auth.service';

// Custom guard
// https://docs.nestjs.com/guards
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(protected usersService: UsersService, protected authService: AuthService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      // Добавляем декодированный токен в объект запроса
      request.user = this.authService.validateToken(token);
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
