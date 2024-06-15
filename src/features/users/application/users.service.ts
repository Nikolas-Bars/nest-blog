import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
import bcrypt from "bcrypt";

// Для провайдера всегда необходимо применять декоратор @Injectable() и регистрировать в модуле
@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async create(email: string, login: string, password: string) {

    const salt = await bcrypt.genSalt(10)

    const passwordHash = await this._generateHash(password, salt)

    const result = await this.usersRepository.insert({
      email,
      login,
      password: passwordHash,
      salt,
      createdAt: new Date().toISOString(),
    });
    // await this.sendMessageOnEmail(email);

    return result._id.toString();
  }
  async deleteUser(id) {
    return await this.usersRepository.delete(id)
  }

  async _generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt)

  }

  sendMessageOnEmail(email: string) {
    console.log(`email adapter sent email = ${email}`);
    return Promise.resolve(true);
  }
  async checkExistenceOfUser(email: string, login: string) {
    return await this.usersRepository.checkExistenceOfUser(email, login)
  }
}
