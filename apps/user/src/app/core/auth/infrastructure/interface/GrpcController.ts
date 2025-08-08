import { AuthenticateRequest, AuthServiceController, AuthServiceControllerMethods, CreateUserRequest, SuccessResponse, User } from "@backend/grpc";
import { Controller } from "@nestjs/common";
import { Observable } from "rxjs";

@Controller()
@AuthServiceControllerMethods()
export class AuthGrpcController implements AuthServiceController {
    authenticate(request: AuthenticateRequest): Promise<SuccessResponse> | Observable<SuccessResponse> | SuccessResponse {
        throw new Error("Method not implemented.");
    }
    createUserSession(request: CreateUserRequest): Promise<User> | Observable<User> | User {
        throw new Error("Method not implemented.");
    }
}
