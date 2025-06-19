import { registerAs } from '@nestjs/config';
import baseDatabaseConfig from './base-database.config';
import { User } from '@libs/dao/user/user.entity';
import { Product } from '@libs/dao/product/product.entity';
import { Inventory } from '@libs/dao/inventory/inventory.entity';

export default registerAs('api-database', () => ({
  ...baseDatabaseConfig,

  type: process.env.DB_TYPE ?? 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  name: process.env.DB_DATABASE,
  database: process.env.DB_DATABASE,
  synchronize: true,

  entities: [User, Product, Inventory],
}));
