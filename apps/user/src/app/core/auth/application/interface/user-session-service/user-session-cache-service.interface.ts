import { UserData, DeviceInfo, TokenPair } from "@backend/grpc";
import { UserSession } from '../../../domain/entities/UserSession';

export interface IUserSessionService {
    createSession(userData: UserData, deviceInfo: DeviceInfo): Promise<TokenPair>;
    revokeSession(session: UserSession, reason?: string): Promise<void>;
    findById(userId: string): Promise<UserSession>
}