import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { ContextIdFactory, ModuleRef } from "@nestjs/core";
import { Observable } from "rxjs";
import { RequestStorageInstance } from "../../request-storage";

@Injectable()
export class CommandContextInterceptor implements NestInterceptor {
  constructor(
    private readonly moduleRef: ModuleRef,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const command = context.getArgByIndex(0);

    const contextId = ContextIdFactory.create();
    this.moduleRef.registerRequestByContextId(command, contextId);

    RequestStorageInstance.reset(command)

    return next.handle();
  }
}