import {IsString, Length} from 'class-validator';
import {Trim} from '../../../../../common/decorators/transform/trim';
import {IsOptionalEmail} from '../../../../../common/decorators/validate/is-optional-email';
import { ContainsLetter } from '../../../../../common/decorators/validate/contains-letter';
import { NameIsExist } from '../../../../../common/decorators/validate/name-is-exist.decorator';
import { LoginIsExist } from '../../../../../common/decorators/validate/login-is-exist.decorator';
import { EmailIsExist } from '../../../../../common/decorators/validate/email-is-exist.decorator';

export class UserCreateModelDto {
    @Trim()
    @IsString()
    @Length(5, 20, {message: 'Fucking length of login is not correct'})
    @LoginIsExist()
    @ContainsLetter({ message: 'Login must contain at least one letter' })
    login: string;

    @IsOptionalEmail()
    @EmailIsExist()
    email: string;

    @IsString()
    @Length(6, 20, {message: 'Length of password is not correct'})
    password: string
}
