import { EntityManager, Repository } from 'typeorm';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import { InsertResult } from 'typeorm/query-builder/result/InsertResult';
import { UpsertOptions } from 'typeorm/repository/UpsertOptions';
import { SaveOptions } from 'typeorm/repository/SaveOptions';
import { TypeOrmHelper } from '@libs/common/databases/typeorm/typeorm.helper';
import { ClassConstructor } from 'class-transformer';
import { getCustomRepository } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { PaginatedResultDto } from '@libs/common/pagination/dto/pagination-result-dto';

export abstract class AbstractRepository<Entity> extends Repository<Entity> {
  protected readonly alias: string = super.metadata.tableName;

  private get entityManager(): EntityManager {
    const queryRunner = TypeOrmHelper.getQueryRunner(
      this.metadata.connection.name,
    );

    return queryRunner ? queryRunner.manager : this.manager;
  }

  get getQueryBuilder(): SelectQueryBuilder<Entity> {
    return this.entityManager.createQueryBuilder(this.target, this.alias);
  }

  /**
   * id 로 조회
   * @param id
   */
  async findById(id: number): Promise<Entity> {
    return this.getQueryBuilder
      .where(`${this.alias}.id=:id`, { id: id })
      .getOne();
  }

  /**
   * id 들로 다중 조회
   * @param ids
   */
  async findByIdIn(ids: number[]): Promise<Entity[]> {
    return this.getQueryBuilder.whereInIds(ids).getMany();
  }

  async insert(
    entityOrEntities:
      | QueryDeepPartialEntity<Entity>
      | QueryDeepPartialEntity<Entity>[],
  ): Promise<InsertResult> {
    return this.getQueryBuilder.insert().values(entityOrEntities).execute();
  }

  async upsert(
    entityOrEntities:
      | QueryDeepPartialEntity<Entity>
      | QueryDeepPartialEntity<Entity>[],
    conflictPathsOrOptions: string[] | UpsertOptions<Entity>,
  ): Promise<InsertResult> {
    return this.entityManager.upsert(
      this.target,
      entityOrEntities,
      conflictPathsOrOptions,
    );
  }

  async save<T>(entity: T, options?: SaveOptions): Promise<T>;
  async save<T>(entities: T[], options?: SaveOptions): Promise<T[]>;
  async save<T>(
    entityOrEntities: T | T[],
    options?: SaveOptions,
  ): Promise<T | T[]> {
    return await this.entityManager.save(entityOrEntities, options);
  }

  async updateById<Entity>(
    id: number,
    values: QueryDeepPartialEntity<Entity>,
  ): Promise<UpdateResult> {
    return this.getQueryBuilder
      .update(this.alias)
      .set(values)
      .where(`${this.alias}.id = :id`, { id: id })
      .execute();
  }

  async updateByIdIn<Entity>(
    ids: number[],
    values: QueryDeepPartialEntity<Entity>,
  ): Promise<UpdateResult> {
    return this.getQueryBuilder
      .update(this.alias)
      .set(values)
      .whereInIds(ids)
      .execute();
  }

  async deleteById(id: number): Promise<DeleteResult> {
    return this.getQueryBuilder
      .delete()
      .from(this.alias)
      .where(`${this.alias}.id = :id`, { id: id })
      .execute();
  }

  async deleteByIdIn(ids: number[]): Promise<DeleteResult> {
    return this.getQueryBuilder
      .delete()
      .from(this.alias)
      .whereInIds(ids)
      .execute();
  }

  /**
   * offset pagination query
   */
  async paginateQuery(
    queryBuilder: SelectQueryBuilder<Entity>,
    page: number,
    limit: number,
  ): Promise<PaginatedResultDto<Entity>> {
    const [items, totalItems] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return PaginatedResultDto.from({
      items,
      total: totalItems,
      currentPage: page,
      limit,
    });
  }

  static instance<T>(this: ClassConstructor<T>, database: string): T {
    return getCustomRepository(this, database);
  }
}
