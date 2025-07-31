// libs/interceptors/transactional.interceptor.ts
import { DatabaseInjectionToken } from '@backend/database';
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { DataSource } from 'typeorm';
import { RequestStorageInstance } from '../../request-storage';

@Injectable()
export class TransactionalInterceptor implements NestInterceptor {
  constructor(
    @Inject(DatabaseInjectionToken.DATA_SOURCE)
    private readonly dataSource: DataSource
  ) {
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    const isNested = queryRunner.isTransactionActive;
    if (isNested) {
      RequestStorageInstance.increaseTransactionDepth();
    }

    if (!isNested) {
      RequestStorageInstance.resetTransactionDepth();
      return from(
        queryRunner.startTransaction().then(() =>
          next.handle().pipe(
            tap(async () => {
              const depth = RequestStorageInstance.getStorage().transactionDepth;
              console.log("Depth of transaction: ", depth);
              
              if (depth <= 0) {
                await queryRunner.commitTransaction();
                await queryRunner.release();
              } else {
                RequestStorageInstance.decreaseTransactionDepth();
              }
            }),
            catchError(async (err) => {
              const depth = RequestStorageInstance.getStorage().transactionDepth;
              if (depth <= 0) {
                await queryRunner.rollbackTransaction();
                await queryRunner.release();
              } else {
                RequestStorageInstance.decreaseTransactionDepth();
              }
              throw err;
            }),
          ),
        ),
      ).pipe();
    }

    return next.handle().pipe(
      tap(() => {
        RequestStorageInstance.decreaseTransactionDepth();
      }),
      catchError((err) => {
        RequestStorageInstance.decreaseTransactionDepth();
        throw err;
      }),
    );
  }
}