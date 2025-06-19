import { Test } from '@nestjs/testing';
import { ApiModule } from '../../src/api.module';

export const getTestModule = Test.createTestingModule({
  imports: [ApiModule],
}).compile();
