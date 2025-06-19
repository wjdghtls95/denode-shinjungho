import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator';
import { Inventory } from '@libs/dao/inventory/inventory.entity';
import { PaginatedResultDto } from '@libs/common/pagination/dto/pagination-result-dto';
import { InventoryHistoryInDto } from '@libs/dao/inventory/dto/inventory-history-in.dto';

@EntityRepository(Inventory)
export class InventoryRepository extends AbstractRepository<Inventory> {
  /**
   * 제품 아이디로 조회
   */
  async findByProductId(productId: number): Promise<Inventory[]> {
    return this.getQueryBuilder
      .where(`${this.alias}.productId=:productId`, { productId: productId })
      .getMany();
  }

  /**
   * 입고 / 출고 기준 및 조건별 재고 히스토리 조회
   */
  async findByInventoryType(
    inventoryHistoryInDto: InventoryHistoryInDto,
  ): Promise<PaginatedResultDto<Inventory>> {
    const { type, order, page, limit } = inventoryHistoryInDto;

    const queryBuilder = this.getQueryBuilder
      .where(`${this.alias}.type=:type`, { type: type })
      .orderBy(`${this.alias}.createdAt`, order);

    return this.paginateQuery(queryBuilder, page, limit);
  }
}
