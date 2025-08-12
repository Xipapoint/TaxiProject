import { Transactional } from "@backend/nestjs";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RpcException } from "@nestjs/microservices";
import { CreateUserSessionCommand } from '../command/create-user-session-command/create-user-session-command';
import { ResponseOnCreateUserSession } from '../dto';
import { IUserSessionService } from '../interface';

@CommandHandler(CreateUserSessionCommand)
export class CreateUserSessionCommandHandler implements ICommandHandler<CreateUserSessionCommand, ResponseOnCreateUserSession> {
    constructor(
        private readonly userSessionService: IUserSessionService,
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