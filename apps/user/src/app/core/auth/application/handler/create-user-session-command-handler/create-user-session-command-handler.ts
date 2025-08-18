import { NestjsInjectionToken, QueryRunnerManager, Transactional } from "@backend/nestjs";
import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RpcException } from "@nestjs/microservices";
import { CreateUserSessionCommand } from '../../command/create-user-session-command/create-user-session-command';
import { ResponseOnCreateUserSession } from '../../dto';
import { InjectionToken } from "../../injection-token";
import { IUserSessionManager } from '../../interface';

@CommandHandler(CreateUserSessionCommand)
export class CreateUserSessionCommandHandler implements ICommandHandler<CreateUserSessionCommand, ResponseOnCreateUserSession> {
    constructor(
        @Inject(InjectionToken.USER_SESSION_MANAGER)
        private readonly userSessionService: IUserSessionManager,
        @Inject(NestjsInjectionToken.QUERY_RUNNER_MANAGER)
        private readonly queryRunnerManager: QueryRunnerManager
    ) {}

    @Transactional()
    async execute(command: CreateUserSessionCommand): Promise<ResponseOnCreateUserSession> {
        try {
            const { deviceInfo, userData } = command.props
            const result = await this.userSessionService.createSession(userData, deviceInfo)
            const {accessToken, refreshToken} = result
             return {
                userData,
                tokenPair: {
                    refreshToken,
                    accessToken,
                }
            };
        } catch (error) {
            throw new RpcException(`Failed to create user session: ${error}`);
        }
    }
    
}