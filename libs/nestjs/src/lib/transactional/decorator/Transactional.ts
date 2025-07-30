// libs/nestjs/transactional/transactional.decorator.ts
import { ModuleRef } from '@nestjs/core';
import { ModuleRefStore } from '../../module-ref/store/module-ref.store';
import { TransactionManagerService } from '../transactional-service/TransactionalService';

export function Transactional() {
  return (
    target: Record<string, any>,
    key: string,
    descriptor: PropertyDescriptor,
  ) => {
    const originalMethod = descriptor.value;
      descriptor.value = async function (...args: any[]) {
        const moduleRef: ModuleRef = (this as any)?.moduleRef ?? ModuleRefStore.get();

        const txService = await moduleRef.resolve(TransactionManagerService, undefined, {
          strict: false,
        });

        return txService.runInTransaction(() => originalMethod.apply(this, args));
      };
  };
}
