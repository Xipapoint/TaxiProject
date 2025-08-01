import { InternalServerErrorException } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { QueryRunner } from 'typeorm';


class Storage {
  constructor(
    readonly transactionDepth = 0,
    readonly queryRunner?: QueryRunner,
  ) {}
}

export interface RequestStorage {
  reset: (requestContextObject: any) => void;
  resetTransactionDepth: () => void;
  increaseTransactionDepth: () => void;
  decreaseTransactionDepth: () => void;
  getStorage: () => Storage
}

export class RequestStorageImplement implements RequestStorage {
  private readonly storage = new AsyncLocalStorage<Storage>();

  reset(requestContextObject: any): void {
    this.storage.enterWith({ transactionDepth: 0 });
  }

  resetTransactionDepth(): void {
    const storage = this.getStorage();
    this.storage.enterWith({ ...storage, transactionDepth: 0 });
  }

  increaseTransactionDepth(): void {
    const storage = this.getStorage();
    this.storage.enterWith({
      ...storage,
      transactionDepth: storage.transactionDepth + 1,
    });
  }

  decreaseTransactionDepth(): void {
    const storage = this.getStorage();
    this.storage.enterWith({
      ...storage,
      transactionDepth: storage.transactionDepth - 1,
    });
  }

  getStorage(): Storage {
    const storage = this.storage.getStore();
    if (!storage)
      throw new InternalServerErrorException('RequestStorage is not found');
    return storage;
  }
}

export const RequestStorageInstance = new RequestStorageImplement();