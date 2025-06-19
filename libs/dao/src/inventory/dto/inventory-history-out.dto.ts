import { ApiProperty } from '@nestjs/swagger';
import { InventoryType } from '@libs/common/constants/inventory-type.constants';
import { BaseOutDto } from '@libs/dao/base/base-out.dto';

export class InventoryHistoryOutDto extends BaseOutDto {
  @ApiProperty({ description: '히스토리 ID' })
  id: number;

  @ApiProperty({ description: '제품 ID' })
  productId: number;

  @ApiProperty({ description: '수량' })
  quantity: number;

  @ApiProperty({ description: '유통기한', nullable: true })
  expirationDate?: string;

  @ApiProperty({ description: '타입', enum: ['IN', 'OUT'] })
  type: InventoryType;

  @ApiProperty({ description: '처리 일자' })
  createdAt: string;
}
