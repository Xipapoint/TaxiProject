import { Module } from '@nestjs/common';
import { GrpcInjectionToken } from './injection-token/injection-token';
import { BaseGrpcTransport } from './transport/grpc-transport';

@Module({
  controllers: [],
  providers: [
    {
      provide: GrpcInjectionToken.BASE_GRPC_TRANSPORT,
      useClass: BaseGrpcTransport
    }

  ],
  exports: [GrpcInjectionToken.BASE_GRPC_TRANSPORT],
})
export class GrpcModule {}
