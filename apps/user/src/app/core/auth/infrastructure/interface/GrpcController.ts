import { AuthServiceController, AuthServiceControllerMethods, CreateUserSessionResponse, RefreshTokensResponse, SuccessResponse, TokenPair, TokensAndDataRequest, UserDataWithDeviceRequest } from "@backend/grpc";
import { GrpcCatchFilter } from "@backend/nestjs";
import { Controller, UseFilters } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateUserSessionCommand } from '../../application/command/create-user-session-command/create-user-session-command';
import { RefreshTokensSessionCommand } from '../../application/command/refresh-tokens-session-command/refresh-tokens-session-command';
import { ResponseOnCreateUserSession } from '../../application/dto';

@Controller()
@AuthServiceControllerMethods()
@UseFilters(GrpcCatchFilter)
export class AuthGrpcController implements AuthServiceController {
    constructor(readonly commandBus: CommandBus, readonly queryBus: QueryBus) {}
    async refreshTokens(request: TokensAndDataRequest): Promise<RefreshTokensResponse> {
        const response = await this.commandBus.execute<RefreshTokensSessionCommand, TokenPair>(new RefreshTokensSessionCommand({
            ...request
        }))

        return {
            success: true,
            data: {
                ...response
            }
        }
    }
    async authenticate(request: TokensAndDataRequest): Promise<SuccessResponse> {
        throw new Error("Method not implemented.");
    }

    async createUserSession(request: UserDataWithDeviceRequest): Promise<CreateUserSessionResponse> {
        const response = await this.commandBus.execute<CreateUserSessionCommand, ResponseOnCreateUserSession>(new CreateUserSessionCommand({
            ...request
        }))
        return {
            success: true,
            data: {
                userData: response.userData,
                tokenPair: response.tokenPair
            }
        }
    }
}
