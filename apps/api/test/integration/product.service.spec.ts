import { TestingModule } from '@nestjs/testing';
import { ProductRepository } from '@libs/dao/product/product.repository';
import { TestProductUtils } from '../utils/test-product.utils';
import { ProductInDto } from '@libs/dao/product/dto/product-in.dto';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { PaginationQueryDto } from '@libs/common/pagination/pagination-query.dto';
import { getTestModule } from '../utils/test.module';
import { ProductService } from '../../src/product/product.service';
import { TypeOrmHelper } from '@libs/common/databases/typeorm/typeorm.helper';
import { TestDataSourceUtils } from '../utils/test-data-source.utils';
import { TestTransactionUtils } from '../utils/test-transaction.utils';

describe('Product Service', () => {
  let module: TestingModule;
  let productService: ProductService;
  let productRepository: ProductRepository;

  beforeAll(async () => {
    module = await getTestModule;
    productService = module.get<ProductService>(ProductService);
    productRepository = module.get<ProductRepository>(ProductRepository);
  });

  beforeEach(async () => {
    await TypeOrmHelper.Transactional([process.env.DB_DATABASE]);
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

  it('제품 생성 성공', async () => {
    const productInDto = new ProductInDto();
    productInDto.name = '테스트 상품';
    productInDto.desc = '설명입니다';

    const productOutDto = await productService.create(productInDto);

    expect(productOutDto.name).toBe(productInDto.name);
    expect(productOutDto.desc).toBe(productInDto.desc);

    const found = await productRepository.findByName(productInDto.name);
    expect(found).toBeDefined();
  });

  it('중복 제품 생성 시 에러 발생', async () => {
    const productInDto = new ProductInDto();
    productInDto.name = '중복 상품';
    productInDto.desc = '중복 설명';

    await productService.create(productInDto);

    try {
      await productService.create(productInDto);
      fail('PRODUCT_ALREADY_CREATED not thrown');
    } catch (e) {
      expect(e.response.message).toBe(
        INTERNAL_ERROR_CODE.PRODUCT_ALREADY_CREATED,
      );
    }
  });

  it('재고 제품 목록 조회 (페이지네이션)', async () => {
    await TestProductUtils.seedProducts(5);

    const paginationQueryDto: PaginationQueryDto = {
      page: 1,
      limit: 10,
    };

    const result = await productService.getProducts(paginationQueryDto);

    expect(result.items.length).toBeGreaterThan(0);
    expect(result.total).toBeGreaterThan(0);
    expect(result.currentPage).toBe(1);
  });
});
