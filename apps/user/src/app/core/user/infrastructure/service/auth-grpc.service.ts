import { AUTH_SERVICE_NAME, AuthServiceClient, CreateUserSessionResponse, Packages, UserDataWithDeviceRequest } from "@backend/grpc";
import { AuthServiceTransport } from '../../application/dto';
import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";

@Injectable()
export class AuthGrpcService implements AuthServiceTransport, OnModuleInit {
    private authService: AuthServiceClient;
    constructor(@Inject(Packages.AUTH) private readonly client: ClientGrpc) {}
    onModuleInit() {
        this.authService = this.client.getService(AUTH_SERVICE_NAME)
    }
    async createUser(data: UserDataWithDeviceRequest): Promise<CreateUserSessionResponse> {
        return await lastValueFrom(this.authService.createUserSession(data))
    }
}