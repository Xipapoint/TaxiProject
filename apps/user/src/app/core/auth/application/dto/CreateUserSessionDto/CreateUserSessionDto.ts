import { DeviceInfo, UserData } from "@backend/grpc";

export interface CreateUserSession {
    userData: UserData
    deviceInfo: DeviceInfo
}