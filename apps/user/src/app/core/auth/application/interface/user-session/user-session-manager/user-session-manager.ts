import { UserData, DeviceInfo, TokenPair } from "@backend/grpc";
import { UserSession } from '../../../../domain/entities/UserSession';
export interface IUserSessionManager {
  createSession(userData: UserData, deviceInfo: DeviceInfo): Promise<TokenPair>;
  refreshSession(userData: UserData, deviceInfo: DeviceInfo, previousVersion: number): Promise<TokenPair>;
  revokeSession(session: UserSession, reason?: string): Promise<void>;
}