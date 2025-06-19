import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class InventoryStockInDto {
  @ApiProperty({ description: '제품 아이디' })
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({ description: '입고 수량' })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({ description: '유통기한' })
  @IsOptional()
  expirationDate?: string;
}
