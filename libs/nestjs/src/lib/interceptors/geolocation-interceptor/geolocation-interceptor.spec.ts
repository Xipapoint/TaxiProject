import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';
import { GeolocationInterceptor } from './geolocation-interceptor';
import { GeolocationIpService, Location } from '../../dto';
import { NestjsInjectionToken } from '../../enums';

describe('GeolocationInterceptor', () => {
  let interceptor: GeolocationInterceptor;
  let mockLocationIpService: jest.Mocked<GeolocationIpService>;

  beforeEach(async () => {
    mockLocationIpService = {
      getGeolocationByIp: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeolocationInterceptor,
        {
          provide: NestjsInjectionToken.GEOLOCATION_SERVICE,
          useValue: mockLocationIpService,
        },
      ],
    }).compile();

    interceptor = module.get<GeolocationInterceptor>(GeolocationInterceptor);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should add geolocation to request metadata for HTTP requests', async () => {
    const mockLocation: Location = {
      countryCode: 'US',
      country_name: 'United States',
      city: 'New York',
      latitude: 40.7128,
      longitude: -74.0060,
    };

    mockLocationIpService.getGeolocationByIp.mockResolvedValue(mockLocation);

    const mockRequest = {
      headers: { 'x-forwarded-for': '192.168.1.1' },
      metadata: {
        geolocation: mockLocation
      },
    };

    const mockContext = {
      getType: () => 'http',
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;

    const mockCallHandler: CallHandler = {
      handle: () => of('test response'),
    };

    const result = await interceptor.intercept(mockContext, mockCallHandler);
    
    result.subscribe();

    expect(mockLocationIpService.getGeolocationByIp).toHaveBeenCalledWith('192.168.1.1');
    expect(mockRequest.metadata.geolocation).toEqual(mockLocation);
  });

  it('should skip non-HTTP requests', async () => {
    const mockContext = {
      getType: () => 'rpc',
    } as ExecutionContext;

    const mockCallHandler: CallHandler = {
      handle: () => of('test response'),
    };

    const result = await interceptor.intercept(mockContext, mockCallHandler);
    
    result.subscribe();

    expect(mockLocationIpService.getGeolocationByIp).not.toHaveBeenCalled();
  });

  it('should handle errors gracefully', async () => {
    mockLocationIpService.getGeolocationByIp.mockRejectedValue(new Error('API error'));

    const mockRequest = {
      headers: { 'x-forwarded-for': '192.168.1.1' },
      metadata: {} as { geolocation?: any },
    };

    const mockContext = {
      getType: () => 'http',
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;

    const mockCallHandler: CallHandler = {
      handle: () => of('test response'),
    };

    await expect(interceptor.intercept(mockContext, mockCallHandler)).rejects.toThrow(
      new Error('Failed to get geolocation'),
    );

    expect(mockRequest.metadata.geolocation).toBeUndefined();
  });
});
