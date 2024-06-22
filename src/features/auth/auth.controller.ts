import { AuthService } from './auth.service';
import { BadRequestException, Body, Controller, HttpCode, Post, Res, UnauthorizedException } from '@nestjs/common';
import { InputAuthModel, RegistrationDataType } from './models/input.auth.model';
import { Response } from 'express';
import { UserCreateModelDto } from '../users/api/models/input/create-user.input.model';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}
  @Post('/login')
  @HttpCode(200)
  async login(@Body() body: InputAuthModel, @Res() res: Response) {
    // Здесь можно проводить аутентификацию пользователя
    const { loginOrEmail, password } = body;

    const tokens: { accessToken: string } | null = await this.authService.login(loginOrEmail, password);

    if (!tokens) throw new UnauthorizedException();

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true, // Защита от XSS атак
      secure: true,  // Использовать только по HTTPS (убедись, что используешь HTTPS)
    });

    return res.send ({
      accessToken: tokens.accessToken
    })
  }

  @HttpCode(204)
  @Post('registration')
  async registration(@Body() data: UserCreateModelDto) {

    const result = await this.authService.registerUser(data)

    // если существует пользователь то возвращаем 400
    if (!result) throw new BadRequestException()

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