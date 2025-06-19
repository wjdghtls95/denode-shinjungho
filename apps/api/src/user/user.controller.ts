import { UserService } from './user.service';
import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { RegisterDto } from '@libs/dao/user/dto/register.dto';
import { RegisterOutDto } from '@libs/dao/user/dto/register-out.dto';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity.decorator';
import { ResponseEntity } from '@libs/common/network/response.entity';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '@libs/common/decorator/auth.decorator';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userSerivce: UserService) {}

  @Post('register')
  @ApiResponseEntity({ summary: '회원가입' })
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<ResponseEntity<RegisterOutDto>> {
    const registerOutDto = await this.userSerivce.register(registerDto);

    return ResponseEntity.ok().body(registerOutDto);
  }

  @Get('me')
  @ApiResponseEntity({ summary: '자신 조회' })
  @Auth()
  getMe(@Req() req) {
    return req.user;
  }
}
