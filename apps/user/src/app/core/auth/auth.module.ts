import { Logger, Module, Provider } from "@nestjs/common";
import { AuthGrpcController } from './infrastructure/interface/GrpcController';
import { UserSessionFactory } from './domain/factories/user-session/user-session.factory';
import { InjectionToken } from './application/injection-token';
import { UserSessionCacheRepositoryImplement } from './infrastructure/repository/UserSessionCacheRepositoryImplement';
import { CreateUserSessionCommandHandler } from './application/handler/create-user-session-command-handler';
import { CqrsModule } from "@nestjs/cqrs";
import { RedisModule } from "@backend/redis";
import { JwtTokenService } from './infrastructure/services/JwtTokenService';
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtAccessTokenStrategy } from "./infrastructure/strategies/JwtAccessTokenStrategy";
import { JwtRefreshTokenStrategy } from './infrastructure/strategies/JwtRefreshTokenStrategy';

const domain = [UserSessionFactory]

const infrastructure: Provider[] = [
  {
    provide: InjectionToken.USER_SESSION_REPOSITORY,
    useClass: UserSessionCacheRepositoryImplement,
  },
  {
    provide: InjectionToken.JWT_TOKEN_SERVICE,
    useClass: JwtTokenService
  }
]

const application = [
    CreateUserSessionCommandHandler
]

@Module({
    controllers: [AuthGrpcController],
    providers: [Logger, JwtAccessTokenStrategy, JwtRefreshTokenStrategy, ...domain, ...infrastructure, ...application],
    imports: [
        CqrsModule, 
        RedisModule,
        JwtModule
    ]
})
export class AuthModule {}