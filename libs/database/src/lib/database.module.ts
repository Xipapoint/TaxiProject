import { Global, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DataSource,
  EntityManager,
  EntityTarget,
  ObjectLiteral,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';

interface WriteConnection {
  readonly startTransaction: (
    level?:
      | 'READ UNCOMMITTED'
      | 'READ COMMITTED'
      | 'REPEATABLE READ'
      | 'SERIALIZABLE',
  ) => Promise<void>;
  readonly commitTransaction: () => Promise<void>;
  readonly rollbackTransaction: () => Promise<void>;
  readonly isTransactionActive: boolean;
  readonly manager: EntityManager;
}

interface ReadConnection {
  readonly getRepository: <T extends ObjectLiteral>(
    target: EntityTarget<T>,
  ) => Repository<T>;
  readonly query: (query: string) => Promise<void>;
  readonly createQueryBuilder: <Entity extends ObjectLiteral>(
    entityClass: EntityTarget<Entity>,
    alias: string,
    queryRunner?: QueryRunner,
  ) => SelectQueryBuilder<Entity>;
}

export let writeConnection = {} as WriteConnection;
export let readConnection = {} as ReadConnection;

class DatabaseService implements OnModuleInit, OnModuleDestroy {

  constructor(private readonly configService: ConfigService) {}

  private readonly dataSource = new DataSource({
    type: 'mysql',
    entities: [],
    charset: 'utf8mb4_unicode_ci',
    logging: this.configService.getOrThrow("DATABASE_LOGGING"),
    host: this.configService.getOrThrow("DATABASE_HOST"),
    port: this.configService.getOrThrow("DATABASE_PORT"),
    database: this.configService.getOrThrow("DATABASE_NAME"),
    username: this.configService.getOrThrow("DATABASE_USER"),
    password: this.configService.getOrThrow("DATABASE_PASSWORD"),
    synchronize: this.configService.getOrThrow("DATABASE_SYNC"),
  });

  async onModuleInit(): Promise<void> {
    await this.dataSource.initialize();
    if (!this.dataSource.isInitialized)
      throw new Error('DataSource is not initialized');
    writeConnection = this.dataSource.createQueryRunner();
    readConnection = this.dataSource.manager;
  }

  async onModuleDestroy(): Promise<void> {
    await this.dataSource.destroy();
  }
}

export class EntityId extends String {
  constructor() {
    super(crypto.randomUUID().split('-').join(''));
  }
}

export const ENTITY_ID_TRANSFORMER = 'EntityIdTransformer';

export interface EntityIdTransformer {
  from: (dbData: Buffer) => string;
  to: (stringId: string) => string;
}

class EntityIdTransformerImplement implements EntityIdTransformer {
  from(dbData: Buffer): string {
    return Buffer.from(dbData.toString('binary'), 'ascii').toString('hex');
  }

  to(entityData: string): string {
    return Buffer.from(entityData, 'hex');
  }
}

@Global()
@Module({
  providers: [
    DatabaseService,
    {
      provide: ENTITY_ID_TRANSFORMER,
      useClass: EntityIdTransformerImplement,
    },
  ],
  exports: [ENTITY_ID_TRANSFORMER],
})
export class DatabaseModule {}