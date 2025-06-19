import { TestingModule } from '@nestjs/testing';
import { UserRepository } from '@libs/dao/user/user.repository';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { TestDataSourceUtils } from '../utils/test-data-source.utils';
import { getTestModule } from '../utils/test.module';
import { TypeOrmHelper } from '@libs/common/databases/typeorm/typeorm.helper';
import { TestTransactionUtils } from '../utils/test-transaction.utils';
import { hash } from 'bcrypt';
import { RegisterDto } from '@libs/dao/user/dto/register.dto';
import { UserService } from '../../src/user/user.service';

describe('AuthService', () => {
  let module: TestingModule;
  let userService: UserService;
  let userRepository: UserRepository;

  beforeAll(async () => {
    module = await getTestModule;

    userService = module.get<UserService>(UserService);

    userRepository = module.get<UserRepository>(UserRepository);
  });

  beforeEach(async () => {
    await TypeOrmHelper.Transactional([process.env.DB_DATABASE]);
  });

  afterEach(async () => {
    await TestTransactionUtils.rollback();
  });

  afterAll(async () => {
    await TestDataSourceUtils.clearDataSource(module);
    await module.close();
  });

  it('회원가입 성공', async () => {
    const registerDto = new RegisterDto();
    registerDto.email = 'register@test.com';
    registerDto.password = 'test1234';
    registerDto.name = '회원가입유저';

    const registerOutDto = await userService.register(registerDto);

    expect(registerOutDto.email).toBe(registerDto.email);
    expect(registerOutDto.name).toBe(registerDto.name);

    const user = await userRepository.findByEmail(registerDto.email);

    const password = await hash(registerDto.password, 10);

    expect(user).toBeDefined();
    expect(password).not.toBe(user.password); // 암호화 확인
  });

  it('중복 회원가입 시 예외 발생', async () => {
    const registerDto = new RegisterDto();
    registerDto.email = 'duplicate@test.com';
    registerDto.password = 'test1234';
    registerDto.name = '중복유저';

    await userService.register(registerDto);

    try {
      await userService.register(registerDto);
      fail('USER_ALREADY_CREATED not thrown');
    } catch (e) {
      expect(e.response.message).toBe(INTERNAL_ERROR_CODE.USER_ALREADY_CREATED);
    }
  });
});
