import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { UsersService } from '../../features/users/application/users.service';

@Injectable()
export class CreateUserPipe implements PipeTransform {
  constructor(private readonly usersService: UsersService) {}

  async transform(data) {
    const { login, email } = data;

    const existingUser = await this.usersService.checkExistenceOfUser(email, login)

    if (existingUser) {
      throw new BadRequestException('User with this login or email already exists');
    }

    return data;
  }
}