import { DatabaseModule } from '@backend/database';
import { DynamicModule, Module } from '@nestjs/common';
import { DataSourceOptions } from 'typeorm';
import { NestjsInjectionToken } from './enums';
import { CatchFilter } from './filters/CatchFilter/CatchFilter';
import { RequestStorageImplement } from './request-storage/storage/RequestStorage';
import { TransactionManagerService } from './transactional/transactional-service/TransactionalService';
import { RequestStorageMiddleware } from './request-storage/middleware/request-storage.middleware';

@Module({})
export class LibNestjsModule {
  static forRootAsync(
    configFactory: () => Promise<DataSourceOptions>
  ): DynamicModule {
    return {
      imports: [DatabaseModule.forRootAsync(configFactory)],
      providers: [
        {
          provide: NestjsInjectionToken.TRANSACTION_MANAGER_SERVICE,
          useClass: TransactionManagerService,
        },
        {
          provide: NestjsInjectionToken.CATCH_FILTER,
          useClass: CatchFilter,
        },
        {
          provide: NestjsInjectionToken.REQUEST_STORAGE,
          useClass: RequestStorageImplement,
        },
        {
          provide: NestjsInjectionToken.REQUEST_STORAGE_MIDDLEWARE,
          useClass: RequestStorageMiddleware,
        },
      ],
      exports: [
        NestjsInjectionToken.TRANSACTION_MANAGER_SERVICE,
        NestjsInjectionToken.CATCH_FILTER,
        NestjsInjectionToken.REQUEST_STORAGE,
        NestjsInjectionToken.REQUEST_STORAGE_MIDDLEWARE,
      ],
      module: LibNestjsModule,
    };
  }
}
