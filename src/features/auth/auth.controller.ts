import { AuthService } from './auth.service';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  Res,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { InputAuthModel, RegistrationDataType } from './models/input.auth.model';
import { Response } from 'express';
import { UserCreateModelDto } from '../users/api/models/input/create-user.input.model';
import { CreateUserPipe } from '../../infrastructure/pipes/create.user.pipe';
import { ConfirmCodePipe } from '../../infrastructure/pipes/confirm.code.pipe';

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
  @UsePipes(CreateUserPipe)
  async registration(@Body() data: UserCreateModelDto) {

    const result = await this.authService.registerUser(data)

    // если существует пользователь то возвращаем 400
    if (!result) throw new BadRequestException()

  }

  @HttpCode(204)
  @UsePipes(ConfirmCodePipe)
  @Post('registration-confirmation')
  async confirmationCode(@Body() body: {code: string}) {

    const code = body.code

    const result = await this.authService.confirmEmail(code)

    if (!result) throw new BadRequestException()

  }

  @HttpCode(204)
  @Post('registration-email-resending')
  async resendingCode(@Body() body: {email: string}) {

    const result: string | null = await this.authService.resendConfirmationCode(body.email)

    if (!result) throw new BadRequestException([{ message: 'User with this email not found', field: "email" }])

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