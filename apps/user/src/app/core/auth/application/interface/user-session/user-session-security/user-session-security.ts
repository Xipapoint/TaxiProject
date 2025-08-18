import { DeviceInfo } from "@backend/grpc";
import { UserSession } from '../../../../domain/entities/UserSession';

export interface IUserSessionSecurity {
    checkSuspiciousActivity(deviceInfo: DeviceInfo, userSession: UserSession): Promise<void>
}