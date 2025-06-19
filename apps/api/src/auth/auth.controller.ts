import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResponseEntity } from '@libs/common/network/response.entity';
import { LoginOutDto } from '@libs/dao/auth/dto/login-out.dto';
import { LoginInDto } from '@libs/dao/auth/dto/login-in.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiResponseEntity({ summary: '로그인' })
  async login(
    @Body() loginInDto: LoginInDto,
  ): Promise<ResponseEntity<LoginOutDto>> {
    const loginOutDto = await this.authService.login(loginInDto);

    return ResponseEntity.ok().body(loginOutDto);
  }
}
