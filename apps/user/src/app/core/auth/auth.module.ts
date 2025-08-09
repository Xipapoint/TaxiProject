import { Logger, Module, Provider } from "@nestjs/common";
import { AuthGrpcController } from './infrastructure/interface/GrpcController';
import { UserSessionFactory } from './domain/factories/user-session/user-session.factory';
import { InjectionToken } from './application/injection-token';
import { UserSessionCacheRepositoryImplement } from './infrastructure/repository/UserSessionCacheRepositoryImplement';
import { CreateUserSessionCommandHandler } from './application/handler/create-user-session-command-handler';
import { CqrsModule } from "@nestjs/cqrs";

const domain = [UserSessionFactory]

const infrastructure: Provider[] = [
  {
    provide: InjectionToken.USER_SESSION_REPOSITORY,
    useClass: UserSessionCacheRepositoryImplement,
  },
]

const application = [
    CreateUserSessionCommandHandler
]

@Module({
    controllers: [AuthGrpcController],
    providers: [Logger, ...domain, ...infrastructure, ...application],
    imports: [CqrsModule]
})
export class AuthModule {}