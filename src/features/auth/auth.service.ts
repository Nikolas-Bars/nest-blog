import { JwtService } from '@nestjs/jwt';
import bcrypt from "bcrypt";
import { UsersRepository } from '../users/infrastructure/users.repository';
import { UserDbType } from '../users/api/models/types/users-types';
import { WithId } from 'mongodb';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {

  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService
  ) {}

  async login(loginOrEmail: string, password: string): Promise<{accessToken: string} | null> {

    const user = await this.usersRepository.findByLoginOrEmail(loginOrEmail)
    // если пользователь не найден или у него нет подтверждения почты
    if (!user || !user.emailConfirmation?.isConfirmed) {
      return null
    }

    const isPasswordCorrect = await this.checkPassword(password, user.password)

    if (!isPasswordCorrect) throw new UnauthorizedException()

    const accessToken = await this.jwtService.sign({userId: user._id})

    return {accessToken}
  }

  async checkPassword(password: string, passwordHash: string) {

    return await bcrypt.compare(password, passwordHash)

  }

  async validateToken(token: string): Promise<any> {
    try {
      return await this.jwtService.decode(token)
    } catch (error) {
      throw new Error('Invalid token')
    }
  }
}