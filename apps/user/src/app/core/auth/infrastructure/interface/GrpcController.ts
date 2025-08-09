import { AuthenticateRequest, AuthServiceController, AuthServiceControllerMethods, CreateUserRequest, SuccessResponse, TokenPair, User } from "@backend/grpc";
import { Controller } from "@nestjs/common";
import { Observable } from "rxjs";
import { ResponseOnCreateUserSession } from '../../application/dto';
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateUserSessionCommand } from '../../application/command/create-user-session-command/create-user-session-command';

@Controller()
@AuthServiceControllerMethods()
export class AuthGrpcController implements AuthServiceController {
    constructor(readonly commandBus: CommandBus, readonly queryBus: QueryBus) {}
    
    authenticate(request: AuthenticateRequest): Promise<SuccessResponse> | Observable<SuccessResponse> | SuccessResponse {
        throw new Error("Method not implemented.");
    }
    async createUserSession(request: CreateUserRequest): Promise<User> {
        const response = await this.commandBus.execute<CreateUserSessionCommand, ResponseOnCreateUserSession>(new CreateUserSessionCommand({
            ...request
        }))
        return {
            userData: response.userData,
            tokenPair: response.tokenPair
        }
    }
}
