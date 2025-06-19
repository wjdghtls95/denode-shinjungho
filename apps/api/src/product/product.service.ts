import { ProductRepository } from '@libs/dao/product/product.repository';
import { Inject, Injectable } from '@nestjs/common';
import { ProductOutDto } from '@libs/dao/product/dto/product-out.dto';
import { ProductInDto } from '@libs/dao/product/dto/product-in.dto';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { Product } from '@libs/dao/product/product.entity';
import { PaginationQueryDto } from '@libs/common/pagination/pagination-query.dto';
import { PaginatedResultDto } from '@libs/common/pagination/dto/pagination-result-dto';

@Injectable()
export class ProductService {
  constructor(
    @Inject(ProductRepository)
    private readonly productRepository: ProductRepository,
  ) {}

  /**
   * 제품 등록
   */
  async create(productInDto: ProductInDto): Promise<ProductOutDto> {
    const { name, desc } = productInDto;

    // 이미 등록된 제품인지 확인
    const isExisted = await this.productRepository.findByName(name);

    if (isExisted) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.PRODUCT_ALREADY_CREATED,
      );
    }

    const product = Product.create({
      name: name,
      desc: desc,
    });

    await this.productRepository.insert(product);

    return ProductOutDto.of(product);
  }

  /**
   * 보유 재고 요청한 개수별 페이지 조회
   */
  async getProducts(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<PaginatedResultDto<ProductOutDto>> {
    const { page, limit } = paginationQueryDto;

    const result = await this.productRepository.findStockedWithPage(
      page,
      limit,
    );

    return PaginatedResultDto.from({
      items: ProductOutDto.fromEntities(result.items),
      total: result.total,
      currentPage: result.currentPage,
      limit: result.totalPages,
    });
  }
}
