import { ApiProperty } from '@nestjs/swagger';
import { BaseOutDto } from '@libs/dao/base/base-out.dto';

export class ProductOutDto extends BaseOutDto {
  @ApiProperty({ description: '제품 이름' })
  name: string;

  @ApiProperty({ description: '현재 재고 수량', default: 0 })
  stock: number;

  @ApiProperty({ description: '제품 설명' })
  desc?: string;
}
