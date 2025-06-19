import { TestingModule } from '@nestjs/testing';
import { TypeOrmHelper } from '@libs/common/databases/typeorm/typeorm.helper';
import { TestTransactionUtils } from '../utils/test-transaction.utils';
import { TestDataSourceUtils } from '../utils/test-data-source.utils';
import { getTestModule } from '../utils/test.module';
import { InventoryService } from '../../src/inventory/inventory.service';
import { InventoryRepository } from '@libs/dao/inventory/inventory.repository';
import { ProductRepository } from '@libs/dao/product/product.repository';
import { TestProductUtils } from '../utils/test-product.utils';
import { InventoryStockInDto } from '@libs/dao/inventory/dto/inventory-stock-in.dto';
import { INVENTORY_TYPE } from '@libs/common/constants/inventory-type.constants';
import { Product } from '@libs/dao/product/product.entity';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { InventoryStockOutDto } from '@libs/dao/inventory/dto/inventory-stock-out.dto';

describe('Inventory Service', () => {
  let module: TestingModule;

  let inventoryService: InventoryService;

  let inventoryRepository: InventoryRepository;
  let productRepository: ProductRepository;

  let product: Product;

  beforeAll(async () => {
    module = await getTestModule;

    inventoryService = module.get<InventoryService>(InventoryService);

    inventoryRepository = module.get<InventoryRepository>(InventoryRepository);
    productRepository = module.get<ProductRepository>(ProductRepository);
  });

  beforeEach(async () => {
    await TypeOrmHelper.Transactional([process.env.DB_DATABASE]);

    // test - Create Seed Product
    product = await TestProductUtils.seedProduct('TestProduct');
  });

  afterEach(async () => {
    await TestTransactionUtils.rollback();
  });

  afterAll(async () => {
    await Promise.all([
      TestDataSourceUtils.clearDataSource(module),
      module.close(),
    ]);
  });

  it('Inventory Service define', async () => {
    expect(inventoryService).toBeDefined();
  });

  it('재고 입고 성공', async () => {
    // product 가 없을때 exception
    const inventoryStockInDto = new InventoryStockInDto();
    inventoryStockInDto.productId = 99999;
    inventoryStockInDto.quantity = 10;

    try {
      await inventoryService.inventoryStockIn(inventoryStockInDto);
      fail('PRODUCT_NOT_FOUND not thrown');
    } catch (e) {
      expect(e.response.message).toBe(INTERNAL_ERROR_CODE.PRODUCT_NOT_FOUND);
    }

    // product 가 존재할 때
    inventoryStockInDto.productId = product.id;

    const result = await inventoryService.inventoryStockIn(inventoryStockInDto);

    expect(result.productId).toBe(product.id);
    expect(result.quantity).toBe(inventoryStockInDto.quantity);
    expect(result.type).toBe(INVENTORY_TYPE.IN);
  });

  it('트랜잭션 실패 시 - 재고 및 인벤토리 모두 롤백', async () => {
    // inventoryRepository.insert 에서 오류 유도 (트랜잭션 실패 목적)
    jest.spyOn(inventoryRepository, 'insert').mockImplementationOnce(() => {
      throw new Error('ERROR'); // 강제 예외 발생
    });

    const inventoryStockInDto = new InventoryStockInDto();
    inventoryStockInDto.productId = product.id;
    inventoryStockInDto.quantity = 20;

    try {
      await inventoryService.inventoryStockIn(inventoryStockInDto);
      fail('ERROR not thrown');
    } catch (e) {
      expect(e.message).toBe('ERROR');
    }

    const updatedProduct = await productRepository.findById(product.id);

    const inventories = await inventoryRepository.findByProductId(product.id);

    // 트랜잭션 롤백이 일어나서 stock 변화 없음 & inventory 미저장
    expect(inventories.length).toBe(0);
    expect(updatedProduct.stock).toBe(0);
  });

  it('재고 출고 성공', async () => {
    // 우선 입고로 재고 채우기
    await inventoryService.inventoryStockIn({
      productId: product.id,
      quantity: 100,
    });

    const inventoryStockOutDto = new InventoryStockOutDto();
    inventoryStockOutDto.productId = product.id;
    inventoryStockOutDto.quantity = 40;

    const inventoryResponseOutDto = await inventoryService.inventoryStockOut(
      inventoryStockOutDto,
    );

    expect(inventoryResponseOutDto.productId).toBe(product.id);
    expect(inventoryResponseOutDto.quantity).toBe(40);
    expect(inventoryResponseOutDto.type).toBe(INVENTORY_TYPE.OUT);

    const updatedProduct = await productRepository.findById(product.id);
    expect(updatedProduct.stock).toBe(60);
  });

  it('입고 / 출고 히스토리 조회', async () => {
    const product = await TestProductUtils.seedProduct('히스토리테스트');

    // 입고 2건
    await inventoryService.inventoryStockIn({
      productId: product.id,
      quantity: 10,
    });

    await inventoryService.inventoryStockIn({
      productId: product.id,
      quantity: 20,
    });

    // 출고 1건
    await inventoryService.inventoryStockOut({
      productId: product.id,
      quantity: 5,
    });

    // 입고 히스토리 조회
    const inResult = await inventoryService.getInventoryHistories({
      page: 1,
      limit: 10,
      type: INVENTORY_TYPE.IN, // 전체 조회
      order: 'DESC',
    });

    const inCount = inResult.items.filter(
      (item) => item.type === INVENTORY_TYPE.IN,
    ).length;

    // 입고 히스토리 조회
    const outResult = await inventoryService.getInventoryHistories({
      page: 1,
      limit: 10,
      type: INVENTORY_TYPE.OUT, // 전체 조회
      order: 'DESC',
    });

    const outCount = outResult.items.filter(
      (item) => item.type === INVENTORY_TYPE.OUT,
    ).length;

    expect(inCount).toBe(2);
    expect(outCount).toBe(1);
  });
});
