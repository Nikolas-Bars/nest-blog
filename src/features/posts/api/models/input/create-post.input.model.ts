import { Trim } from '../../../../../common/decorators/transform/trim';
import { IsString, Length, Matches } from 'class-validator';
import { NameIsExist } from '../../../../../common/decorators/validate/name-is-exist.decorator';

export class CreatePostInputModel {
  @Trim()
  @IsString()
  @Length(5, 30, {message: 'Length not correct'})
  // @NameIsExist()
  title: string;

  @Length(5, 100, {message: 'Length not correct'})
  shortDescription: string;

  @Length(5, 1000)
  content: string

  @IsString()
  blogId: string

}