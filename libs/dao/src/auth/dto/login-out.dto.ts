import { ApiProperty } from '@nestjs/swagger';
import { BaseOutDto } from '@libs/dao/base/base-out.dto';

export class LoginOutDto extends BaseOutDto {
  @ApiProperty({ description: 'access token' })
  accessToken: string;
}
