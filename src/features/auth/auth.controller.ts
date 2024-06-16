import { AuthService } from './auth.service';
import { BadRequestException, Body, Controller, Post, Res } from '@nestjs/common';
import { InputAuthModel } from './models/input.auth.model';
import { Response } from 'express';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}
  @Post('/login')

  async login(@Body() body: InputAuthModel, @Res() res: Response) {
    // Здесь можно проводить аутентификацию пользователя
    const { loginOrEmail, password } = body;

    const tokens: { accessToken: string } | null = await this.authService.login(loginOrEmail, password);

    if (!tokens) throw new BadRequestException('Invalid credentials');

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true, // Защита от XSS атак
      secure: true,  // Использовать только по HTTPS (убедись, что используешь HTTPS)
    });

    return res.send ({
      accessToken: tokens.accessToken
    })
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