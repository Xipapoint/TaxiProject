import { DeviceInfo, UserData } from '@backend/grpc';
import { UserSession } from '../../../../domain/entities/UserSession';
import { DeviceInfo as DeviceInfoVO } from "../../../../domain/valueObjects";

export interface IUserSessionVerifier {
    verifyByUserSessionDevice(otherSession: UserSession, userData: UserData, userSession: UserSession): Promise<void>; 
    verifyByUserSession(otherSession: UserSession, userSession: UserSession): Promise<void>;
}