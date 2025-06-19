import { Inject, Injectable } from '@nestjs/common';
import { LoginInDto } from '@libs/dao/auth/dto/login-in.dto';
import { LoginOutDto } from '@libs/dao/auth/dto/login-out.dto';
import { UserRepository } from '@libs/dao/user/user.repository';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserRepository) private readonly userRepository: UserRepository,

    private readonly jwtService: JwtService,
  ) {}

  /**
   * 로그인
   */
  async login(loginInDto: LoginInDto): Promise<LoginOutDto> {
    const { email, password } = loginInDto;

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.USER_NOT_FOUND);
    }

    const isValid = await compare(password, user.password);
    if (!isValid) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.USER_PASSWORD_INVALID);
    }

    const payload = { sub: user.id };

    const accessToken = this.jwtService.sign(payload);

    return LoginOutDto.of({ accessToken: accessToken });
  }
}
