import { Product } from '@libs/dao/product/product.entity';
import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator';
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { PaginatedResultDto } from '@libs/common/pagination/dto/pagination-result-dto';

@EntityRepository(Product)
export class ProductRepository extends AbstractRepository<Product> {
  /**
   * 제품 이름으로 조회
   */
  async findByName(name: string): Promise<Product> {
    return this.getQueryBuilder
      .where(`${this.alias}.name=:name`, { name: name })
      .getOne();
  }

  /**
   * 재고 요청 개수로 페이지네이션
   */
  async findStockedWithPage(
    page: number,
    limit: number,
  ): Promise<PaginatedResultDto<Product>> {
    const queryBuilder = this.getQueryBuilder.where(`${this.alias}.stock > 0`);

    return this.paginateQuery(queryBuilder, page, limit);
  }
}
