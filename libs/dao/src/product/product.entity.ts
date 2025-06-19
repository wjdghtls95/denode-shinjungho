import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '@libs/common/databases/typeorm/abstract.entity';

@Entity('products')
export class Product extends AbstractEntity {
  @Column({ comment: '제품 이름', unique: true })
  name: string;

  @Column({ comment: '현재 재고 수량', default: 0 })
  stock: number;

  @Column({ comment: '제품 설명', nullable: true })
  desc?: string;
}
