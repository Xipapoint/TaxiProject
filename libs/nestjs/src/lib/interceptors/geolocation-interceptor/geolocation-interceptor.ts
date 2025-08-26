import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Inject } from '@nestjs/common';
import { NestjsInjectionToken } from '../../enums/InjectionToken/InjectionToken';
import { GeolocationIpService, Location } from '../../dto';

interface RequestWithMetadata {
  headers?: Record<string, string | string[]>;
  connection?: { remoteAddress?: string };
  socket?: { remoteAddress?: string };
  ip?: string;
  metadata?: {
    geolocation?: Location;
    [key: string]: unknown;
  };
}

@Injectable()
export class GeolocationInterceptor implements NestInterceptor {
  constructor(@Inject(NestjsInjectionToken.GEOLOCATION_SERVICE) private readonly locationIpService: GeolocationIpService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<unknown>> {
    if (context.getType() === 'http') {
      const request: RequestWithMetadata = context.switchToHttp().getRequest();
      
      // Извлекаем IP из запроса
      const ip = this.extractIpFromRequest(request);
      
      if (ip) {
        try {
          // Получаем геолокацию по IP
          const location = await this.locationIpService.getGeolocationByIp(ip);
          
          // Инициализируем metadata если его нет
          if (!request.metadata) {
            request.metadata = {};
          }
          
          // Сохраняем геолокацию в metadata
          request.metadata.geolocation = location;
        } catch (error) {
          throw new Error('Failed to get geolocation');
          // TODO: LOGGING GLOBAL
        }
      }
    }

    return next.handle();
  }

  private extractIpFromRequest(request: RequestWithMetadata): string | null {
    // Пытаемся извлечь IP из различных заголовков
    const forwardedFor = request.headers?.['x-forwarded-for'];
    const forwardedForValue = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor;
    
    const ip = 
      forwardedForValue?.split(',')[0]?.trim() ||
      (Array.isArray(request.headers?.['x-real-ip']) ? request.headers['x-real-ip'][0] : request.headers?.['x-real-ip']) ||
      (Array.isArray(request.headers?.['x-client-ip']) ? request.headers['x-client-ip'][0] : request.headers?.['x-client-ip']) ||
      request.connection?.remoteAddress ||
      request.socket?.remoteAddress ||
      request.ip;

    // Очищаем IPv6-mapped IPv4 адреса
    if (ip && ip.startsWith('::ffff:')) {
      return ip.substring(7);
    }

    return ip || null;
  }
}
