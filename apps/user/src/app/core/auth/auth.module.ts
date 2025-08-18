import { Logger, Module, Provider } from "@nestjs/common";
import { AuthGrpcController } from './infrastructure/interface/GrpcController';
import { UserSessionFactory } from './domain/factories/user-session/user-session.factory';
import { InjectionToken } from './application/injection-token';
import { UserSessionCacheRepositoryImplement } from './infrastructure/repository/UserSessionCacheRepositoryImplement';
import { CreateUserSessionCommandHandler } from './application/handler/create-user-session-command-handler/create-user-session-command-handler';
import { CqrsModule } from "@nestjs/cqrs";
import { RedisModule } from "@backend/redis";
import { JwtTokenService } from './infrastructure/services/JwtTokenService';
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtAccessTokenStrategy } from "./infrastructure/strategies/JwtAccessTokenStrategy";
import { JwtRefreshTokenStrategy } from './infrastructure/strategies/JwtRefreshTokenStrategy';

const domain = [UserSessionFactory]

import { UserSessionRepositoryImplement } from './infrastructure/repository/UserSessionRepositoryImplement';
import { TokenService } from './infrastructure/services/tokens-service/tokens.service';
import { UserSessionPersistenceService } from './infrastructure/services/user-session-persistance-service/user-session-persistance.service';
import { UserSessionService } from './infrastructure/services/UserSessionService';
import { UserSessionManager } from './infrastructure/services/user-session/user-session-manager/user-session-manager';
import { UserSessionSecurity } from './infrastructure/services/user-session/user-session-security/user-session-security';
import { SessionVerifier } from './infrastructure/services/user-session/user-session-verifier/user-session-verifier';

const infrastructure: Provider[] = [
  {
    provide: InjectionToken.USER_SESSION_CACHE_REPOSITORY,
    useClass: UserSessionCacheRepositoryImplement,
  },
  {
    provide: InjectionToken.JWT_TOKEN_SERVICE,
    useClass: JwtTokenService
  },
  {
    provide: InjectionToken.USER_SESSION_REPOSITORY,
    useClass: UserSessionRepositoryImplement,
  },
  {
    provide: InjectionToken.TOKEN_SERVICE,
    useClass: TokenService,
  },
  {
    provide: InjectionToken.USER_SESSION_PERSISTANCE_SERVICE,
    useClass: UserSessionPersistenceService,
  },
  {
    provide: InjectionToken.USER_SESSION_SERVICE,
    useClass: UserSessionService,
  },
  {
    provide: InjectionToken.USER_SESSION_MANAGER,
    useClass: UserSessionManager,
  },
  {
    provide: InjectionToken.USER_SESSION_SECURITY,
    useClass: UserSessionSecurity,
  },
  {
    provide: InjectionToken.USER_SESSION_VERIFIER,
    useClass: SessionVerifier,
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