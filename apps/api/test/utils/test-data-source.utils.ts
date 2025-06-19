import { DataSource } from 'typeorm';
import { getDataSourceToken } from '@nestjs/typeorm';
import { TestingModule } from '@nestjs/testing';

export class TestDataSourceUtils {
  static async clearDataSource(module: TestingModule): Promise<void> {
    try {
      const dataSource = module.get<DataSource>(
        getDataSourceToken(process.env.DB_DATABASE),
      );

      // 초기화 됬는지 확인
      if (dataSource?.isInitialized) {
        await dataSource.destroy();
      }
    } catch (e) {
      console.warn(
        '[TestDataSourceUtils] Failed to destroy datasource:',
        e.message,
      );
    }
  }
}
