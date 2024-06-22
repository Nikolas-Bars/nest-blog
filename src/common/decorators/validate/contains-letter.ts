import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ async: false })
export class ContainsLetterConstraint implements ValidatorConstraintInterface {
  validate(text: string) {
    return /[a-zA-Z]/.test(text); // Проверяем, что строка содержит хотя бы одну букву
  }

  defaultMessage() {
    return 'Login must contain at least one letter';
  }
}

export function ContainsLetter(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: ContainsLetterConstraint,
    });
  };
}