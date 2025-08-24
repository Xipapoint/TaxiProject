import { IErrorHandler } from '../interfaces/error-handler/error-handler.interface';
import { RpcException } from '@nestjs/microservices';

// Handles gRPC RpcException
export class GrpcErrorHandler implements IErrorHandler<unknown> {
  canHandle(exception: unknown): boolean {
    return exception instanceof RpcException;
  }

  handle(exception: unknown) {
    const rpcError = exception as RpcException;
    let errorMessage = 'Internal server error';
    let statusCode = 500; // gRPC INTERNAL default
    const error = rpcError.getError();
    if (typeof error === 'string') {
      errorMessage = error;
    } else if (typeof error === 'object' && error !== null) {
      const errObj = error as Record<string, unknown>;
      errorMessage = (errObj['message'] as string) || errorMessage;
      statusCode = (errObj['status'] as number) || (errObj['code'] as number) || statusCode;
    }
    return { statusCode, errorMessage, isOperational: false };
  }
}
