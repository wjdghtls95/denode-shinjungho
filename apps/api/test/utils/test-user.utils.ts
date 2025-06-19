import { User } from '@libs/dao/user/user.entity';
import { UserRepository } from '@libs/dao/user/user.repository';
import { hash } from 'bcrypt';
import { TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';

export class TestUserUtils {
  /**
   * 테스트용 유저 생성
   */
  static async createUser(email: string, password: string): Promise<User> {
    const userRepository = UserRepository.instance(process.env.DB_DATABASE);

    const user = User.create({
      email: email,
      password: await hash(password, 10),
    });

    await userRepository.insert(user);
    return user;
  }

  /**
   * 로그인된 유저의 accessToken 발급
   */
  static async loginUser(user: User, module: TestingModule): Promise<string> {
    const jwtService = module.get<JwtService>(JwtService);

    const payload = { sub: user.id };
    return jwtService.sign(payload);
  }
}
