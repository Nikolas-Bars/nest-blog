import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from '../../features/users/application/users.service';
import { AuthService } from '../../features/auth/auth.service';

// Custom guard
// https://docs.nestjs.com/guards
@Injectable()
export class BasicAuthGuard implements CanActivate {
  constructor() {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    if(request.headers['authorization'] === 'Basic YWRtaW46cXdlcnR5') {
      return true
    } else {
      throw new UnauthorizedException('Incorrect login or password');
    }
  }
}
