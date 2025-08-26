# Geolocation Interceptor

Этот interceptor автоматически извлекает IP-адрес из HTTP-запроса, получает геолокацию через `GeolocationIpService` и сохраняет результат в `req.metadata.geolocation`.

## Использование

### 1. Импортируйте interceptor и интерфейсы

```typescript
import { GeolocationInterceptor, GeolocationIpService, Location } from '@backend/nestjs';
```

### 2. Зарегистрируйте interceptor в модуле

```typescript
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GeolocationInterceptor } from '@backend/nestjs';
import { LocationIpService } from './services/location-ip.service';

@Module({
  providers: [
    LocationIpService,
    {
      provide: APP_INTERCEPTOR,
      useClass: GeolocationInterceptor,
    },
  ],
})
export class AppModule {}
```

### 3. Используйте в контроллере

```typescript
import { Controller, Get, Req } from '@nestjs/common';

interface RequestWithGeolocation extends Request {
  metadata?: {
    geolocation?: Location;
  };
}

@Controller()
export class AppController {
  @Get('/location')
  getLocation(@Req() req: RequestWithGeolocation) {
    const geolocation = req.metadata?.geolocation;
    return {
      message: 'User location detected',
      location: geolocation,
    };
  }
}
```

## Интерфейсы

### Location
```typescript
interface Location {
  countryCode: string;
  country_name: string;
  city: string;
  latitude: number;
  longitude: number;
}
```

### GeolocationIpService
```typescript
interface GeolocationIpService {
  getGeolocationByIp(ip: string, format?: string): Promise<Location>;
}
```

## Особенности

- Interceptor работает только с HTTP-запросами (пропускает gRPC)
- Автоматически извлекает IP из различных заголовков:
  - `x-forwarded-for`
  - `x-real-ip` 
  - `x-client-ip`
  - `connection.remoteAddress`
  - `socket.remoteAddress`
  - `ip`
- Обрабатывает IPv6-mapped IPv4 адреса
- В случае ошибки получения геолокации просто логирует предупреждение и продолжает выполнение
- Сохраняет результат в `req.metadata.geolocation`
