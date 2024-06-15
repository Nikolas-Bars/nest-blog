import { AuthService } from './auth.service';
import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { InputAuthModel } from './models/input.auth.model';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}
  @Post('/login')

  async login(@Body() body: InputAuthModel) {
    // Здесь можно проводить аутентификацию пользователя
    const { loginOrEmail, password } = body;

    const tokens: { accessToken: string } | null = await this.authService.login(loginOrEmail, password);

    if (!tokens) throw new BadRequestException('Invalid credentials');

    const tokenObject = {
      accessToken: tokens.accessToken
    }
  }
  @Post('protected')
  async protectedResource(@Body() body: { token: string }): Promise<any> {
    try {
      const decodedToken = await this.authService.validateToken(body.token);
      // Здесь возвращаем защищенные данные или что-то еще, требующее аутентификации
      return { message: 'Access granted', user: decodedToken };
    } catch (error) {
      throw new BadRequestException('Invalid token');
    }
  }

}