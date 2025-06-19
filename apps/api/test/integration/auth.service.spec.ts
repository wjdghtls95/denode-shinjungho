import { TestingModule } from '@nestjs/testing';
import { getTestModule } from '../../test/utils/test.module';
import { LoginInDto } from '@libs/dao/auth/dto/login-in.dto';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { AuthService } from '../../src/auth/auth.service';
import { TestUserUtils } from '../utils/test-user.utils';
import { TypeOrmHelper } from '@libs/common/databases/typeorm/typeorm.helper';
import { TestTransactionUtils } from '../utils/test-transaction.utils';
import { TestDataSourceUtils } from '../utils/test-data-source.utils';

describe('Auth Service ', () => {
  let module: TestingModule;

  let authService: AuthService;

  const testEmail = 'testuser@email.com';
  const testPassword = '1234';

  beforeAll(async () => {
    module = await getTestModule;

    authService = module.get<AuthService>(AuthService);
  });

  beforeEach(async () => {
    await TypeOrmHelper.Transactional([process.env.DB_DATABASE]);

    // test - Create Test User
    await TestUserUtils.createUser(testEmail, testPassword);
  });

  afterEach(async () => {
    await TestTransactionUtils.rollback();
  });

  afterAll(async () => {
    await Promise.all([
      TestDataSourceUtils.clearDataSource(module),
      module.close(),
    ]);
  });

  it('auth service defined', async () => {
    expect(authService).toBeDefined();
  });

  it('로그인 성공', async () => {
    const loginInDto = new LoginInDto();
    loginInDto.email = testEmail;
    loginInDto.password = testPassword;

    const loginOutDto = await authService.login(loginInDto);

    expect(loginOutDto).toBeDefined();
    expect(loginOutDto.accessToken).toBeDefined();
    expect(typeof loginOutDto.accessToken).toBe('string');
  });

  it('이메일이 존재하지 않을 때 실패', async () => {
    const loginInDto = new LoginInDto();
    loginInDto.email = 'none@email.com';
    loginInDto.password = testPassword;

    try {
      await authService.login(loginInDto);
      fail('USER_NOT_FOUND not thrown');
    } catch (e) {
      expect(e.response.message).toBe(INTERNAL_ERROR_CODE.USER_NOT_FOUND);
    }
  });

  it('비밀번호가 틀릴 때 실패', async () => {
    const loginInDto = new LoginInDto();
    loginInDto.email = testEmail;
    loginInDto.password = 'wrongpassword';

    try {
      await authService.login(loginInDto);
      fail('USER_PASSWORD_INVALID not thrown');
    } catch (e) {
      expect(e.response.message).toBe(
        INTERNAL_ERROR_CODE.USER_PASSWORD_INVALID,
      );
    }
  });
});
