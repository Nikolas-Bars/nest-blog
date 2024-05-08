import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersRepository } from '../../../features/users/infrastructure/users.repository';
import { Injectable } from '@nestjs/common';

// Обязательна регистрация в ioc
@ValidatorConstraint({ name: 'NameIsExist', async: true })
@Injectable()
export class NameIsExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly usersRepository: UsersRepository) {}
  async validate(value: any, args: ValidationArguments) {
    const nameIsExist = await this.usersRepository.nameIsExist(value);
    return !nameIsExist;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Name already exist';
  }
}

// https://github.com/typestack/class-validator?tab=readme-ov-file#custom-validation-decorators
export function NameIsExist(
  property?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: NameIsExistConstraint,
    });
  };
}
