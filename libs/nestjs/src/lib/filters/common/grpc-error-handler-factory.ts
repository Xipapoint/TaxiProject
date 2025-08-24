import { IErrorHandler } from '../interfaces/error-handler/error-handler.interface';
import { GrpcErrorHandler } from '../handlers/grpc-error-handler';
import { AppGrpcErrorHandler } from '../handlers/app-grpc-error-handler';
import { NativeGrpcErrorHandler } from '../handlers/native-grpc-error-handler';
import { UnknownGrpcErrorHandler } from '../handlers/unknown-grpc-error-handler';

// Factory for gRPC error handler strategies
export class GrpcErrorHandlerFactory {
  private readonly handlers: IErrorHandler[];

  constructor() {
    this.handlers = [
      new GrpcErrorHandler(),
      new AppGrpcErrorHandler(),
      new NativeGrpcErrorHandler(),
      new UnknownGrpcErrorHandler(),
    ];
  }

  getHandler(exception: unknown): IErrorHandler {
    return this.handlers.find((h) => h.canHandle(exception))!;
  }
}
