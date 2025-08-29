import { CreateUserSessionResponse, UserDataWithDeviceRequest } from '@backend/grpc';

export interface AuthServiceTransport {
    createUser: (data: UserDataWithDeviceRequest) => Promise<CreateUserSessionResponse>
}