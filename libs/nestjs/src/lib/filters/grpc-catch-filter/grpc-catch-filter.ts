import { Catch, RpcExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { AppError } from '../../errors/AppError/AppError';



@Catch(RpcException, Error, AppError)
export class GrpcCatchFilter implements RpcExceptionFilter {
  catch(exception: any, host: ArgumentsHost): Observable<any> {
    let errorMessage = 'Internal server error';
    let statusCode = 13; // gRPC INTERNAL по умолчанию

    if (exception instanceof RpcException) {
      const error = exception.getError();

      if (typeof error === 'string') {
        errorMessage = error;
      } else if (typeof error === 'object' && error !== null) {
            const errObj = error as Record<string, any>;
            errorMessage = errObj['message'] || errorMessage;
            statusCode = errObj['status'] || errObj['code'] || statusCode;
      }
    } else if (exception instanceof AppError) {
      errorMessage = exception.message || errorMessage;
      statusCode = exception.statusCode || statusCode;
    } else if (exception instanceof Error) {
      errorMessage = exception.message || errorMessage;
    }

    return throwError(() => ({
      success: false,
      errorMessage,
      statusCode,
    }));
  }
}