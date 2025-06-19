import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginInDto {
  @ApiProperty({ description: '유저 이메일' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: '유저 비밀번호' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
