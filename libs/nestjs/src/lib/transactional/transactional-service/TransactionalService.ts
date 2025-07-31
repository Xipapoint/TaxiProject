import { DatabaseInjectionToken } from '@backend/database';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { RequestStorageInstance } from '../../request-storage/storage/RequestStorage';

@Injectable({ scope: Scope.REQUEST })
export class TransactionManagerService {
  private queryRunner?: QueryRunner;

  constructor(
    @Inject(DatabaseInjectionToken.DATA_SOURCE) private readonly dataSource: DataSource, 
  ) {}

  async runInTransaction<T>(cb: () => Promise<T>): Promise<T> {
    if (this.queryRunner?.isTransactionActive) {
      RequestStorageInstance.increaseTransactionDepth();
      return cb().finally(() => RequestStorageInstance.decreaseTransactionDepth());
    }

    this.queryRunner = this.dataSource.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
    RequestStorageInstance.resetTransactionDepth();

    try {
      const result = await cb();

      if (RequestStorageInstance.getStorage().transactionDepth <= 0)
        await this.queryRunner.commitTransaction();
      return result;
    } catch (err) {
      if (RequestStorageInstance.getStorage().transactionDepth <= 0)
        await this.queryRunner.rollbackTransaction();
      throw err;
    } finally {
      if (RequestStorageInstance.getStorage().transactionDepth <= 0) {
        await this.queryRunner.release();
        this.queryRunner = undefined;
      }
    }
  }

  getManager() {
    return this.queryRunner?.manager ?? this.dataSource.manager;
  }
}
