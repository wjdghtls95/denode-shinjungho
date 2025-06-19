import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '@libs/common/databases/typeorm/abstract.entity';

@Entity('users')
export class User extends AbstractEntity {
  @Column({ comment: '유저 이메일', unique: true })
  email: string;

  @Column({ comment: '비밀번호' })
  password: string;

  @Column({ comment: '유저 이름', nullable: true, default: null })
  name?: string;
}
