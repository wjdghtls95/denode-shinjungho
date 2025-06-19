import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import apiDatabaseConfig from './api-database.config';

const env = process.env.NODE_ENV || 'test';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `./config/.api.${env}.env`,
      isGlobal: true,
      cache: true,
      load: [apiDatabaseConfig],
    }),
  ],
})
export class ApiServerConfigModule {}
