import { Module } from '@nestjs/common';
import { UserRepository } from '@libs/dao/user/user.repository';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';

@Module({
  imports: [
    TypeOrmExModule.forFeatures([UserRepository], [process.env.DB_DATABASE]),
  ],
  exports: [TypeOrmExModule],
})
export class UserModule {}
