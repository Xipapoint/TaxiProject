import { LibNestjsModule, ModuleRefStore, RequestStorageMiddleware } from '@backend/nestjs';
import { MiddlewareConsumer, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientEntity } from './core/user/infrastructure/entity';
import { UserModule } from './core/user/user.module';
import { ModuleRef } from '@nestjs/core';
import { DatabaseModule } from '@backend/database';
import { DatabaseOptions } from '../database-options';
import { User } from './core/user/infrastructure/entity/User';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [ClientEntity, User]
    }),
    }),
    UserModule,
    DatabaseModule.forRootAsync(async () => DatabaseOptions),
    LibNestjsModule.forRootAsync(async () => DatabaseOptions),
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly moduleRef: ModuleRef) {}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestStorageMiddleware).forRoutes('*');
  }

  onModuleInit() {
    ModuleRefStore.set(this.moduleRef);
  }
}
