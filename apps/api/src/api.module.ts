import { ApiServerConfigModule } from './config/api-server-config.module';
import { Module, ValidationPipe } from '@nestjs/common';
import { DefaultModule } from './default/default.module';
import { DefaultController } from './default/default.controller';
import { ClsModule } from 'nestjs-cls';
import ApiDatabaseConfig from './config/api-database.config';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AllExceptionFilter } from '@libs/common/filter/all-exception.filter';
import { UserController } from './user/user.controller';
import { UserModule } from '@libs/dao/user/user.module';
import { UserService } from './user/user.service';
import { AuthModule } from '@libs/dao/auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { ProductModule } from '@libs/dao/product/product.module';
import { ProductController } from './product/product.controller';
import { ProductService } from './product/product.service';
import { TransactionInterceptor } from '@libs/common/interceptor/transaction.interceptor';
import { Inventory } from '@libs/dao/inventory/inventory.entity';
import { InventoryModule } from '@libs/dao/inventory/inventory.module';
import { ProductProvider } from '@libs/common/provider/product.provider';
import { InventoryService } from './inventory/inventory.service';
import { InventoryController } from './inventory/inventory.controller';

@Module({
  imports: [
    // api server config
    ApiServerConfigModule,

    // cls
    ClsModule.forRoot({ global: true, middleware: { mount: true } }),

    // database (rdbms)
    TypeOrmExModule.forRootAsync({
      name: ApiDatabaseConfig().name,
      inject: [ApiDatabaseConfig.KEY],
      useFactory: async (config) => config,
    }),

    // health check
    DefaultModule,

    // auth
    AuthModule,

    // domain
    UserModule,
    ProductModule,
    InventoryModule,
  ],
  controllers: [
    // health check
    DefaultController,

    // auth
    AuthController,

    // domain
    UserController,
    ProductController,
    InventoryController,
  ],
  providers: [
    { provide: APP_PIPE, useValue: new ValidationPipe({ transform: true }) },
    { provide: APP_FILTER, useClass: AllExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: TransactionInterceptor },

    // service
    UserService,
    AuthService,
    ProductService,
    InventoryService,

    // provider
    ProductProvider,
  ],
})
export class ApiModule {}
