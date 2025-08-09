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
    providers: [Logger, ...domain, ...infrastructure, ...application],
    imports: [
        CqrsModule, 
        RedisModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                secret: configService.getOrThrow('JWT_SECRET'),
                signOptions: {
                expiresIn: configService.getOrThrow('JWT_EXPIRATION_MS'),
                },
            }),
            inject: [ConfigService],
        }),
    ]
})
export class AuthModule {}