import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '@libs/dao/user/user.repository';
import { RegisterDto } from '@libs/dao/user/dto/register.dto';
import { User } from '@libs/dao/user/user.entity';
import { hash } from 'bcrypt';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { RegisterOutDto } from '@libs/dao/user/dto/register-out.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject(UserRepository) private readonly userRepository: UserRepository,
  ) {}

  /**
   * 회원가입 (create user)
   */
  async register(registerDto: RegisterDto): Promise<RegisterOutDto> {
    const { email, password, name } = registerDto;

    // 이미 가입한 유저인지 확인
    const isExisted = await this.userRepository.findByEmail(email);

    if (isExisted) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.USER_ALREADY_CREATED);
    }

    const hashedPw = await hash(password, 10);

    const user = User.create({
      email: email,
      password: hashedPw,
      name: name ?? null,
    });

    await this.userRepository.insert(user);

    return RegisterOutDto.of(user);
  }
}
