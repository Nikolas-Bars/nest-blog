import { JwtService } from '@nestjs/jwt';
import bcrypt from "bcrypt";
import { UsersRepository } from '../users/infrastructure/users.repository';
import { UserDbType } from '../users/api/models/types/users-types';
import { WithId } from 'mongodb';
import {v1} from "uuid";
import add from "date-fns/add"
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegistrationDataType } from './models/input.auth.model';
import { UsersService } from '../users/application/users.service';
import { MailService } from '../email/mail.service';

@Injectable()
export class AuthService {

  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
    private usersService: UsersService
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

  async registerUser(data: RegistrationDataType) {

    const {login, email, password} = data

    // проверяем существует ли пользователь
    const user = await this.usersRepository.findByLoginOrEmail(data.login) as WithId<UserDbType>

    if (user) return null

    const salt = await bcrypt.genSalt(10)

    const passwordHash = await this.usersService._generateHash(password, salt)

    const newUser = {
      email: data.email,
      login: data.login,
      password: passwordHash,
      salt: salt,
      createdAt: (new Date).toISOString(),
      emailConfirmation: {
        // confirmationCode - код который уйдет пользователю
        confirmationCode: v1(),
        // expirationDate - дата когда код устареет
        expirationDate: add.add(new Date(), {
          hours: 1,
          minutes: 30
        }),
        isConfirmed: false
      }
    }

    // записываем нового пользователя в базу и получаем его id
    const createdId = await this.usersRepository.insert(newUser as UserDbType)
    if (createdId) {
      // отправляем email на почту с кодом подтверждения
      return await MailService.sendEmailConfirmationMassage(newUser.email, 'Registration new user', newUser.emailConfirmation.confirmationCode)
    }

    return null

  }

  async resendConfirmationCode(email: string): Promise<string | null> {
    const user: WithId<UserDbType> | null = await this.usersRepository.findByLoginOrEmail(email)

    if (user && user.emailConfirmation) {

      const newCode = v1()

      const newExpirationDate = add.add(new Date(), {
        hours: 1,
        minutes: 30
      })

      await this.usersRepository.updateConfirmationCode(user._id.toString(), newCode, newExpirationDate)

      const isConfirmed = user.emailConfirmation.isConfirmed

      if (isConfirmed) return null // если email уже подтвержден
      // если не подтвержден - отправляем письмо заново

      return await MailService.sendEmailConfirmationMassage(user.email, 'Resending code', newCode)

    } else {
      return null
    }
  }

  async confirmEmail(code: string) {

    try {

      const user = await this.usersRepository.getUserByConfirmCode(code)

      if (user && user.emailConfirmation && user.emailConfirmation.expirationDate > new Date() && !user.emailConfirmation.isConfirmed) {

        const id = user._id.toString()

        const result = await this.usersRepository.confirmEmail(id)

        return result ? result : null

      } else {
        return null
      }

    } catch (e) {
      console.error(e)

      return null
    }

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