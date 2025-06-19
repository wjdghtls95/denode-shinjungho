import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ProductInDto {
  @ApiProperty({ description: '제품 아이디' })
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty({ description: '제품 이름' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ description: '현재 재고 수량', default: 0 })
  @IsNumber()
  stock: number;

  @ApiProperty({ description: '제품 설명', nullable: true })
  @IsString()
  @IsOptional()
  desc?: string;
}
