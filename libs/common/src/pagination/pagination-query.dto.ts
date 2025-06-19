import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationQueryDto {
  @ApiPropertyOptional({ description: '현재 페이지', default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;

  @ApiPropertyOptional({ description: '페이지 당 항목 수', default: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number;
}
