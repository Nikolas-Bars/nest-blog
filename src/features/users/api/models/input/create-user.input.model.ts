import {IsString, Length} from 'class-validator';
import {Trim} from '../../../../../common/decorators/transform/trim';
import {IsOptionalEmail} from '../../../../../common/decorators/validate/is-optional-email';
import { ContainsLetter } from '../../../../../common/decorators/validate/contains-letter';

export class UserCreateModelDto {
    @Trim()
    @IsString()
    @Length(5, 20, {message: 'Fucking length of login is not correct'})
    @ContainsLetter({ message: 'Login must contain at least one letter' })
    login: string;

    @IsOptionalEmail()
    email: string;

    @IsString()
    @Length(6, 20, {message: 'Length of password is not correct'})
    password: string
}
