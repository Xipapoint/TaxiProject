import { CreateUserRequest, CreateUserSessionResponse } from '@backend/grpc';

export interface AuthServiceTransport {
    createUser: (data: CreateUserRequest) => Promise<CreateUserSessionResponse>
}