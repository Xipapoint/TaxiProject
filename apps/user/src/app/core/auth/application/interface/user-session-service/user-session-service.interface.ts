import { DeviceInfo, TokenPair, UserData } from "@backend/grpc";
import { UserSession } from '../../../domain/entities/UserSession';

export interface IUserSessionService {
    createSession(userData: UserData, deviceInfo: DeviceInfo): Promise<TokenPair>;
    revokeSession(session: UserSession, reason?: string): Promise<void>;
}