import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { Module } from '@nestjs/common';
import { ProductRepository } from '@libs/dao/product/product.repository';

@Module({
  imports: [
    TypeOrmExModule.forFeatures([ProductRepository], [process.env.DB_DATABASE]),
  ],
  exports: [TypeOrmExModule],
})
export class ProductModule {}
