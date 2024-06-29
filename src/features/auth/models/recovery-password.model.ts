import { IsOptionalEmail } from '../../../common/decorators/validate/is-optional-email';

export class RecoveryInputDto {
  @IsOptionalEmail()
  email: string;
}
