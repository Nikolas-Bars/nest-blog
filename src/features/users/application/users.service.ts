import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';

// Для провайдера всегда необходимо применять декоратор @Injectable() и регистрировать в модуле
@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async create(email: string, name: string) {
    const result = await this.usersRepository.insert({
      email,
      name,
      createdAt: new Date().toISOString(),
    });

    await this.sendMessageOnEmail(email);

    return result._id.toString();
  }

  sendMessageOnEmail(email: string) {
    console.log(`email adapter sent email = ${email}`);
    return Promise.resolve(true);
  }
}
