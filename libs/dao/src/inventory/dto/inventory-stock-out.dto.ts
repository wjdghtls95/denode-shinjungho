import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class InventoryStockOutDto {
  @ApiProperty({ description: '제품 아이디' })
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({ description: '출고 수량' })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

export class InventoryOutDto {}
