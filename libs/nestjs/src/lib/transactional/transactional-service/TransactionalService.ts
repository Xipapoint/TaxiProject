import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { RequestStorage } from '../../request-storage/storage/RequestStorage';
import { DatabaseInjectionToken } from '@backend/database';
import { NestjsInjectionToken } from '../../enums';

@Injectable({ scope: Scope.REQUEST })
export class TransactionManagerService {
  private queryRunner?: QueryRunner;

  constructor(
    @Inject(DatabaseInjectionToken.DATA_SOURCE) private readonly dataSource: DataSource, 
    @Inject(NestjsInjectionToken.REQUEST_STORAGE)
    private readonly requestStorage: RequestStorage
  ) {}

  async runInTransaction<T>(cb: () => Promise<T>): Promise<T> {
    if (this.queryRunner?.isTransactionActive) {
      this.requestStorage.increaseTransactionDepth();
      return cb().finally(() => this.requestStorage.decreaseTransactionDepth());
    }

    this.queryRunner = this.dataSource.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
    this.requestStorage.resetTransactionDepth();

    try {
      const result = await cb();

      if (this.requestStorage.getStorage().transactionDepth <= 0)
        await this.queryRunner.commitTransaction();
      return result;
    } catch (err) {
      if (this.requestStorage.getStorage().transactionDepth <= 0)
        await this.queryRunner.rollbackTransaction();
      throw err;
    } finally {
      if (this.requestStorage.getStorage().transactionDepth <= 0) {
        await this.queryRunner.release();
        this.queryRunner = undefined;
      }
    }
  }

  getManager() {
    return this.queryRunner?.manager ?? this.dataSource.manager;
  }
}
