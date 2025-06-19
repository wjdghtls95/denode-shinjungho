import { Inventory } from '@libs/dao/inventory/inventory.entity';
import { InventoryType } from '@libs/common/constants/inventory-type.constants';
import { Product } from '@libs/dao/product/product.entity';
import { InventoryRepository } from '@libs/dao/inventory/inventory.repository';

export class TestInventoryUtils {
  /**
   * 제품에 대해 다량의 입고 / 출고 생성
   */
  static async seedInventoryUtils(
    products: Product[],
    type: InventoryType,
    count: number,
  ): Promise<Inventory[]> {
    const inventoryRepository = InventoryRepository.instance(
      process.env.DB_DATABASE,
    );
    const bulkInventories: Inventory[] = [];

    for (let i = 0; i < count; i++) {
      const quantity = Math.floor(Math.random() * 10) + 1;
      const product = products[i % products.length]; // 순환

      bulkInventories.push(
        Inventory.create({
          productId: product.id,
          quantity,
          type: type,
          expirationDate: new Date(Date.now() + i * 1000 * 60 * 60 * 24),
        }),
      );
    }

    await inventoryRepository.insert(bulkInventories);

    return bulkInventories;
  }
}
