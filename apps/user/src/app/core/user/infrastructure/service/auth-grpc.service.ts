import { AUTH_SERVICE_NAME, AuthServiceClient, CreateUserRequest, CreateUserSessionResponse, Packages, User } from '@backend/grpc';
import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { AuthServiceTransport } from '../../application/dto';

@Injectable()
export class AuthGrpcService implements AuthServiceTransport, OnModuleInit {
    private authService: AuthServiceClient;
    constructor(@Inject(Packages.AUTH) private readonly client: ClientGrpc) {}
    onModuleInit() {
        this.authService = this.client.getService(AUTH_SERVICE_NAME)
    }
    async createUser(data: CreateUserRequest): Promise<CreateUserSessionResponse> {
        return await lastValueFrom(this.authService.createUserSession(data))
    }
}