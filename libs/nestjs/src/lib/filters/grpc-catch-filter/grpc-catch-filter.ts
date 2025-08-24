import { ArgumentsHost, Catch, ExceptionFilter, Injectable, Logger } from "@nestjs/common";
import { ErrorHandlerFactory } from '../common/error-handler-factory';

@Catch()
@Injectable()
export class GrpcCatchFilter implements ExceptionFilter {
  private readonly logger = new Logger(GrpcCatchFilter.name);
  private readonly errorHandlerFactory = new ErrorHandlerFactory();

  catch(exception: unknown, host: ArgumentsHost) {
    const handler = this.errorHandlerFactory.getHandler(exception);
    const result = handler.handle(exception);

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

    return {
      success: false,
      error: result.errorMessage,
    };
  }
}