import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { ModuleRefStore } from '../../module-ref/store/module-ref.store';
import { RequestStorageInstance } from '../../request-storage';
import { TransactionManagerService } from '../transactional-service/TransactionalService';

export function Transactional() {
  return (
    target: Record<string, any>,
    key: string,
    descriptor: PropertyDescriptor,
  ) => {
    const originalMethod = descriptor.value;
      descriptor.value = async function (...args: any[]) {
        const requestContext = RequestStorageInstance.getStorage();
        
        const contextId = ContextIdFactory.getByRequest(requestContext);

        const moduleRef: ModuleRef = (this as any)?.moduleRef ?? ModuleRefStore.get();
        const txService = await moduleRef.resolve(
          TransactionManagerService,
          contextId,
          { strict: false },
        );

        return txService.runInTransaction(() => originalMethod.apply(this, args));
      };
  };
}
