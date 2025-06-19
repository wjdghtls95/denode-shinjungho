import { Inject, Injectable } from '@nestjs/common';
import { ProductRepository } from '@libs/dao/product/product.repository';
import { Product } from '@libs/dao/product/product.entity';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';

@Injectable()
export class ProductProvider {
  constructor(
    @Inject(ProductRepository)
    private readonly productRepository: ProductRepository,
  ) {}

  /**
   * 제품 재고 추가
   */
  async addProductStock(product: Product, quantity: number): Promise<void> {
    product.stock += quantity;

    await this.productRepository.updateById(product.id, product);
  }

  /**
   * 제품 재고 제거
   */
  async subProductStock(product: Product, quantity: number): Promise<void> {
    // 감소할 재고 수량이 있는지 확인
    if (product.stock < quantity) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.PRODUCT_STOCK_INSUFFICIENT,
      );
    }

    product.stock -= quantity;

    await this.productRepository.updateById(product.id, product);
  }
}
