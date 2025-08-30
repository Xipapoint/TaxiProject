import { Test } from '@nestjs/testing';
import { GrpcModule } from './grpc.module';
import { GrpcInjectionToken } from './injection-token/injection-token';

describe('GrpcModule', () => {
  it('should compile the module', async () => {
    const mockGrpcTransport = {
      unaryCall: jest.fn(),
    };

    const module = await Test.createTestingModule({
      imports: [GrpcModule],
    })
      .overrideProvider(GrpcInjectionToken.BASE_GRPC_TRANSPORT)
      .useValue(mockGrpcTransport)
      .compile();

    expect(module).toBeDefined();
  });
});
