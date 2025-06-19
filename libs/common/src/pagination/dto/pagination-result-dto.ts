import { ApiProperty } from '@nestjs/swagger';

export interface PaginationArgs<T> {
  items: T[];
  total: number;
  currentPage: number;
  limit: number;
}

export class PaginatedResultDto<T> {
  @ApiProperty({ description: '데이터 목록' })
  items: T[];

  @ApiProperty({ description: '총 항목 수' })
  total: number;

  @ApiProperty({ description: '현재 페이지' })
  currentPage: number;

  @ApiProperty({ description: '전체 페이지 수' })
  totalPages: number;

  private constructor(args: PaginationArgs<T>) {
    this.items = args.items;
    this.total = args.total;
    this.currentPage = args.currentPage;
    this.totalPages = Math.ceil(args.total / args.limit);
  }

  static from<T>(args: PaginationArgs<T>): PaginatedResultDto<T> {
    return new PaginatedResultDto(args);
  }
}
