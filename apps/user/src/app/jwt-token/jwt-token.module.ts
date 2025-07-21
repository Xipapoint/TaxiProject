import { Module } from "@nestjs/common";
import { RedisModule } from '@backend/redis';

@Module({})
export class JwtTokenModule {
    imports: [RedisModule]
}