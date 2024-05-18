import { Trim } from '../../../../../common/decorators/transform/trim';
import { IsString, Length, Matches } from 'class-validator';
import { NameIsExist } from '../../../../../common/decorators/validate/name-is-exist.decorator';

export class BlogCreateModel {
  @Trim()
  @IsString()
  @Length(2, 15, {message: 'Length not correct'})
  @NameIsExist()
  name: string;

  @Length(5, 500, {message: 'Length not correct'})
  description: string;

  @Length(5, 100, {message: 'Length not correct'})
  @Matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/, { message: 'Invalid URL format' })
  websiteUrl: string
}