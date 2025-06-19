import { ApiTags } from '@nestjs/swagger';
import { ResponseEntity } from '@libs/common/network/response.entity';
import { ProductOutDto } from '@libs/dao/product/dto/product-out.dto';
import { ProductInDto } from '@libs/dao/product/dto/product-in.dto';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity.decorator';
import { Auth } from '@libs/common/decorator/auth.decorator';
import { PaginationQueryDto } from '@libs/common/pagination/pagination-query.dto';
import { PaginatedResultDto } from '@libs/common/pagination/dto/pagination-result-dto';

@Auth()
@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiResponseEntity({ summary: '제품 등록' })
  async create(
    @Body() productInDto: ProductInDto,
  ): Promise<ResponseEntity<ProductOutDto>> {
    const productOutDto = await this.productService.create(productInDto);

    return ResponseEntity.ok().body(productOutDto);
  }

  @Get()
  @ApiResponseEntity({ summary: '보유 재고 제품 목록 조회' })
  async getStockedProducts(
    @Query() paginationQueryDto: PaginationQueryDto,
  ): Promise<ResponseEntity<PaginatedResultDto<ProductOutDto>>> {
    const pageResult = await this.productService.getPagedStockedProducts(
      paginationQueryDto,
    );

    return ResponseEntity.ok().body(pageResult);
  }
}
