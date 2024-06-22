import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { UsersService } from '../../features/users/application/users.service';
import { UsersRepository } from '../../features/users/infrastructure/users.repository';

@Injectable()
export class ConfirmCodePipe implements PipeTransform {
  constructor(private readonly usersRepository: UsersRepository) {}

  async transform(data) {
    const code = data.code;

    const user = await this.usersRepository.getUserByConfirmCode(code)
    console.log(user, 'user');
    if (!user || (user && user.emailConfirmation && (user.emailConfirmation.expirationDate < new Date() || user.emailConfirmation.isConfirmed))) {
      throw new BadRequestException([{ message: 'invalid confirmation code', field: "code" }]);
    }

    return data;
  }
}