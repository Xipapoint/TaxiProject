import { IErrorHandler } from '../interfaces/error-handler/error-handler.interface';

// Handles native JS Error for gRPC context
export class NativeGrpcErrorHandler implements IErrorHandler<unknown> {
  canHandle(exception: unknown): boolean {
    return exception instanceof Error;
  }

  handle(exception: unknown) {
    const err = exception as Error;
    return {
        statusCode: 13, 
        errorMessage: err.message || 'Internal server error',
        isOperational: false,
    };
  }
}
