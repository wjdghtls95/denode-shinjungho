import { Product } from '@libs/dao/product/product.entity';
import { ProductRepository } from '@libs/dao/product/product.repository';

export class TestProductUtils {
  /**
   * 더미 제품 여러 개 생성
   */
  static async seedProducts(count: number): Promise<Product[]> {
    const productRepository = ProductRepository.instance(
      process.env.DB_DATABASE,
    );

    const products: Product[] = [];

    for (let i = 0; i < count; i++) {
      const product = Product.create({
        name: `테스트 제품 ${i + 1}`,
        stock: 0,
        desc: `설명 ${i + 1}`,
      });

      products.push(product);
    }

    await productRepository.insert(products);
    return products;
  }

  /**
   * 더미 제품 한개 생성
   */
  static async seedProduct(name: string, desc?: string): Promise<Product> {
    const productRepository = ProductRepository.instance(
      process.env.DB_DATABASE,
    );

    if (!productRepository) return null;

    const product = Product.create({ name, stock: 0, desc });

    await productRepository.insert(product);
    return product;
  }
}
