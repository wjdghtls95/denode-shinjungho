import { PaginationQueryDto } from '@libs/common/pagination/pagination-query.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  INVENTORY_TYPE,
  InventoryType,
} from '@libs/common/constants/inventory-type.constants';

export type OrderSortedType = 'ASC' | 'DESC';

export class InventoryHistoryInDto extends PaginationQueryDto {
  @ApiProperty({
    description: '입고(IN) / 출고(OUT)',
    enum: Object.values(INVENTORY_TYPE),
  })
  type: InventoryType;

  @ApiProperty({
    description: '정렬 순서 (DESC: 최신순 / ASC: 오래된순)',
    enum: ['ASC', 'DESC'],
    default: 'DESC',
  })
  order: OrderSortedType;
}
