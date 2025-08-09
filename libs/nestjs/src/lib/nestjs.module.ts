import { DatabaseModule } from '@backend/database';
import { DynamicModule, Module } from '@nestjs/common';
import { DataSourceOptions } from 'typeorm';
import { NestjsInjectionToken } from './enums';
import { CatchFilter } from './filters/CatchFilter/CatchFilter';
import { SuccessResponseInterceptor, TransactionalInterceptor } from './interceptors';
import { RequestStorageMiddleware } from './request-storage/middleware/request-storage.middleware';
import { GrpcCatchFilter } from './filters/grpc-catch-filter/grpc-catch-filter';

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
        },
        {
          provide: NestjsInjectionToken.ADD_SUCCESS_FIELD_INTERCEPTOR,
          useClass: SuccessResponseInterceptor
        },
        {
          provide: NestjsInjectionToken.GRPC_CATCH_FILTER,
          useClass: GrpcCatchFilter,
        },
      ],
      exports: [
        NestjsInjectionToken.CATCH_FILTER,
        NestjsInjectionToken.TRANSACTIONAL_INTERCEPTOR,
        NestjsInjectionToken.REQUEST_STORAGE_MIDDLEWARE,
        NestjsInjectionToken.ADD_SUCCESS_FIELD_INTERCEPTOR,
        NestjsInjectionToken.GRPC_CATCH_FILTER
      ],
      module: LibNestjsModule,
    };
  }
}
