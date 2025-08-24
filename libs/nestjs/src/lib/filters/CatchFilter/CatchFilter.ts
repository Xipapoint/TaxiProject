
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Logger,
  Injectable,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorHandlerFactory } from '../common/error-handler-factory';

/**
 * CatchFilter uses error handler strategies to process different error types.
 * - SRP: delegates error handling logic to dedicated handlers
 * - OCP: new handlers can be added without modifying this filter
 */
@Catch()
@Injectable()
export class CatchFilter implements ExceptionFilter {
  private readonly logger = new Logger(CatchFilter.name);
  private readonly errorHandlerFactory = new ErrorHandlerFactory();

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Select appropriate handler for the exception
    const handler = this.errorHandlerFactory.getHandler(exception);
    const result = handler.handle(exception);

    // Logging based on error type and operational status
    if (!result.isOperational) {
      // Non-operational AppError
      this.logger.error(`Non-operational error: ${result.errorMessage}`);
      // TODO: SEND ALERT TO LOGGING AWS MICROSERVICE
    } else if (result.statusCode && result.statusCode >= 500) {
      this.logger.error(result.errorMessage);
      // TODO: SEND ALERT TO LOGGING AWS MICROSERVICE
    } else {
      this.logger.warn(`[${result.statusCode}] ${result.errorMessage}`);
    }

    response.status(result.statusCode).json({
      success: false,
      message: result.errorMessage,
    });
  }
}