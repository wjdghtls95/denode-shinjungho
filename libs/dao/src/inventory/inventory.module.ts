import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { InventoryRepository } from '@libs/dao/inventory/inventory.repository';

@Module({
  imports: [
    TypeOrmExModule.forFeatures(
      [InventoryRepository],
      [process.env.DB_DATABASE],
    ),
  ],
  exports: [TypeOrmExModule],
})
export class InventoryModule {}
