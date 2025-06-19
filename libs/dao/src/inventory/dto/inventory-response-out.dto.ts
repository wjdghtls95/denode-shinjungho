import { ApiProperty } from '@nestjs/swagger';
import {
  INVENTORY_TYPE,
  InventoryType,
} from '@libs/common/constants/inventory-type.constants';
import { BaseOutDto } from '@libs/dao/base/base-out.dto';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class InventoryResponseOutDto extends BaseOutDto {
  @ApiProperty({ description: '제품 아이디' })
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({ description: '수량' })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({ description: '유통기한', nullable: true })
  @IsOptional()
  expirationDate?: Date;

  @ApiProperty({
    description: '재고 타입 (입고: in | 출고: out)',
    enum: Object.values(INVENTORY_TYPE),
  })
  type: InventoryType;

  @ApiProperty({ description: '재고 등록 날짜' })
  createdAt: Date;

  @ApiProperty({ description: '재고 수정 날짜' })
  updateAt: Date;
}
