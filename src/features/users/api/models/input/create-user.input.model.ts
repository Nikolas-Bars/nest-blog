import {IsString, Length} from 'class-validator';
import {Trim} from '../../../../../common/decorators/transform/trim';
import {IsOptionalEmail} from '../../../../../common/decorators/validate/is-optional-email';

export class UserCreateModelDto {
    @Trim()
    @IsString()
    @Length(5, 20, {message: 'Length not correct'})
    login: string;

    @IsOptionalEmail()
    email: string;

    @IsString()
    @Length(6, 20, {message: 'Length of password is not correct'})
    password: string
}
