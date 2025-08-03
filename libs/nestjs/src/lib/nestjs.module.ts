import { DatabaseModule } from '@backend/database';
import { DynamicModule, Module } from '@nestjs/common';
import { DataSourceOptions } from 'typeorm';
import { NestjsInjectionToken } from './enums';
import { CatchFilter } from './filters/CatchFilter/CatchFilter';
import { TransactionalInterceptor } from './interceptors';
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
          provide: NestjsInjectionToken.CATCH_FILTER,
          useClass: CatchFilter,
        },
        {
          provide: NestjsInjectionToken.TRANSACTIONAL_INTERCEPTOR,
          useClass: TransactionalInterceptor
        },
        {
          provide: NestjsInjectionToken.REQUEST_STORAGE_MIDDLEWARE,
          useClass: RequestStorageMiddleware
        }
      ],
      exports: [
        NestjsInjectionToken.CATCH_FILTER,
        NestjsInjectionToken.TRANSACTIONAL_INTERCEPTOR,
        NestjsInjectionToken.REQUEST_STORAGE_MIDDLEWARE
      ],
      module: LibNestjsModule,
    };
  }
}
