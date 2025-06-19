import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator';
import { User } from '@libs/dao/user/user.entity';
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';

@EntityRepository(User)
export class UserRepository extends AbstractRepository<User> {
  /**
   * 이메일로 유저 조회
   */
  async findByEmail(email: string): Promise<User> {
    return this.getQueryBuilder
      .where(`${this.alias}.email=:email`, { email: email })
      .getOne();
  }
}
