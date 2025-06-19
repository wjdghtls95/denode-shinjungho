import { AbstractDto } from '@libs/dao/base/abstract.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegisterDto extends AbstractDto {
  @ApiProperty({ description: '유저 이메일' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: '비밀번호' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: '유저 이름', nullable: true, default: null })
  @IsString()
  @IsOptional()
  name?: string;
}
