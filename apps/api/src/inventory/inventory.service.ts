import { Inject, Injectable } from '@nestjs/common';
import { InventoryRepository } from '@libs/dao/inventory/inventory.repository';
import { InventoryResponseOutDto } from '@libs/dao/inventory/dto/inventory-response-out.dto';
import { InventoryStockInDto } from '@libs/dao/inventory/dto/inventory-stock-in.dto';
import { ProductRepository } from '@libs/dao/product/product.repository';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { ProductProvider } from '@libs/common/provider/product.provider';
import { Inventory } from '@libs/dao/inventory/inventory.entity';
import { INVENTORY_TYPE } from '@libs/common/constants/inventory-type.constants';
import { InventoryStockOutDto } from '@libs/dao/inventory/dto/inventory-stock-out.dto';
import { Product } from '@libs/dao/product/product.entity';
import { Transactional } from '@libs/common/decorator/transaction.decorator';
import { InventoryHistoryInDto } from '@libs/dao/inventory/dto/inventory-history-in.dto';
import { PaginatedResultDto } from '@libs/common/pagination/dto/pagination-result-dto';
import { InventoryHistoryOutDto } from '@libs/dao/inventory/dto/inventory-history-out.dto';

@Injectable()
export class InventoryService {
  constructor(
    @Inject(InventoryRepository)
    private readonly inventoryRepository: InventoryRepository,
    @Inject(ProductRepository)
    private readonly productRepository: ProductRepository,

    private readonly productProvider: ProductProvider,
  ) {}

  /**
   * 재고 입고
   */
  @Transactional()
  async inventoryStockIn(
    inventoryStockInDto: InventoryStockInDto,
  ): Promise<InventoryResponseOutDto> {
    const { productId, quantity, expirationDate } = inventoryStockInDto;

    // 해당 제품 확인
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.PRODUCT_NOT_FOUND);
    }

    const inventory = Inventory.create({
      productId: productId,
      quantity: quantity,
      type: INVENTORY_TYPE.IN,
      expirationDate: expirationDate ? new Date(expirationDate) : null,
    });

    // 입고 시 수량만큼 product 추가
    await this.productProvider.addProductStock(product, quantity);

    await this.inventoryRepository.insert(inventory);

    return InventoryResponseOutDto.of(inventory);
  }

  /**
   * 재고 출고
   */
  @Transactional()
  async inventoryStockOut(
    inventoryStockOutDto: InventoryStockOutDto,
  ): Promise<InventoryResponseOutDto> {
    const { productId, quantity } = inventoryStockOutDto;

    // 해당 제품 확인
    const product = await this._checkProduct(productId);

    const inventory = Inventory.create({
      productId: productId,
      quantity: quantity,
      type: INVENTORY_TYPE.OUT,
    });

    // 입고 시 수량만큼 product 제거 & inventory 에 저장
    await this.productProvider.subProductStock(product, quantity);

    await this.inventoryRepository.insert(inventory);

    return InventoryResponseOutDto.of(inventory);
  }

  /**
   * 입고 / 출고 히스토리 조회
   */
  async getInventoryHistories(
    inventoryHistoryInDto: InventoryHistoryInDto,
  ): Promise<PaginatedResultDto<InventoryHistoryOutDto>> {
    // inventory type 으로 조회
    const result = await this.inventoryRepository.findByInventoryType(
      inventoryHistoryInDto,
    );

    return PaginatedResultDto.from({
      items: InventoryHistoryOutDto.fromEntities(result.items),
      total: result.total,
      currentPage: result.currentPage,
      limit: result.totalPages,
    });
  }

  /**
   * 제품 존재 확인
   */
  private async _checkProduct(productId: number): Promise<Product> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.PRODUCT_NOT_FOUND);
    }

    return product;
  }
}
