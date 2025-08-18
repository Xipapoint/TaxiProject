import { DeviceInfo, TokenPair, UserData } from "@backend/grpc";
import { UserSession } from '../../../domain/entities/UserSession';
import { DeviceInfo as DeviceInfoVO } from '../../../domain/valueObjects'

export interface IUserSessionService {
    createSession(userData: UserData, deviceInfo: DeviceInfo): Promise<TokenPair>;
    refreshSession(userData: UserData, deviceInfo: DeviceInfo, previousVersion: number): Promise<TokenPair>
    verifyByUserSessionDevice(deviceInfo: DeviceInfoVO, userSession: UserSession): Promise<void>
    verifyByUserSession(deviceInfo: DeviceInfoVO, userSession: UserSession): Promise<void>
    checkSuspiciousActivity(deviceInfo: DeviceInfo, userSession: UserSession): Promise<void>
    verifyTokens(tokens: TokenPair): Promise<TokenPair | null>
    revokeSession(session: UserSession, reason?: string): Promise<void>;
}