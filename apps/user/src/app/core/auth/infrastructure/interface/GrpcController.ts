import { AuthenticateRequest, AuthServiceController, AuthServiceControllerMethods, CreateUserRequest, CreateUserSessionResponse, SuccessResponse, User } from "@backend/grpc";
import { Controller, UseFilters } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { Observable } from "rxjs";
import { CreateUserSessionCommand } from '../../application/command/create-user-session-command/create-user-session-command';
import { ResponseOnCreateUserSession } from '../../application/dto';
import { GrpcCatchFilter } from "@backend/nestjs";

@Controller()
@AuthServiceControllerMethods()
@UseFilters(GrpcCatchFilter)
export class AuthGrpcController implements AuthServiceController {
    constructor(readonly commandBus: CommandBus, readonly queryBus: QueryBus) {}
    
    authenticate(request: AuthenticateRequest): Promise<SuccessResponse> | Observable<SuccessResponse> | SuccessResponse {
        throw new Error("Method not implemented.");
    }
    async createUserSession(request: CreateUserRequest): Promise<CreateUserSessionResponse> {
        const response = await this.commandBus.execute<CreateUserSessionCommand, ResponseOnCreateUserSession>(new CreateUserSessionCommand({
            ...request
        }))
        return {
            success: true,
            user:{
                userData: response.userData,
                tokenPair: response.tokenPair
            }
        }
    }
}
