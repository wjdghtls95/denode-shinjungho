import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '@libs/common/databases/typeorm/abstract.entity';
import {
  INVENTORY_TYPE,
  InventoryType,
} from '@libs/common/constants/inventory-type.constants';

@Entity('inventories')
export class Inventory extends AbstractEntity {
  @Column({ comment: '제품 아이디' })
  productId: number;

  @Column({ comment: '입출고 수량' })
  quantity: number;

  @Column({ comment: '유통 기한', type: 'date', nullable: true })
  expirationDate?: Date;

  @Column({
    comment: '재고 타입 (IN: 입고, OUT: 출고)',
    type: 'enum',
    enum: Object.values(INVENTORY_TYPE),
  })
  type: InventoryType;
}
