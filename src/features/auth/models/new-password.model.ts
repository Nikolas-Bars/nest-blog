import { IsString, Length } from 'class-validator';

export class NewPasswordInputDto {
  @IsString()
  @Length(6, 20, {message: 'Length of password is not correct'})
  newPassword: string

  @IsString()
  recoveryCode: string;
}
