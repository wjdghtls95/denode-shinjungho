import { ApiProperty } from '@nestjs/swagger';

export class PaginationOutDto {
  @ApiProperty({ description: '전체 레코드 수' })
  totalItems: number;

  @ApiProperty({ description: '현재 페이지' })
  currentPage: number;

  @ApiProperty({ description: '전체 페이지' })
  totalPages: number;

  constructor(totalItems: number, currentPage: number, limit: number) {
    this.totalItems = totalItems;
    this.currentPage = currentPage;
    this.totalPages = Math.ceil(totalItems / limit);
  }
}
