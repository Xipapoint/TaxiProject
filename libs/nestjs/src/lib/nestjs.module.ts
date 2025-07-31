import { DatabaseModule } from '@backend/database';
import { DynamicModule, Module } from '@nestjs/common';
import { DataSourceOptions } from 'typeorm';
import { NestjsInjectionToken } from './enums';
import { CatchFilter } from './filters/CatchFilter/CatchFilter';
import { TransactionalInterceptor } from './interceptors';

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
        }
      ],
      exports: [
        NestjsInjectionToken.CATCH_FILTER,
        NestjsInjectionToken.TRANSACTIONAL_INTERCEPTOR
      ],
      module: LibNestjsModule,
    };
  }
}
