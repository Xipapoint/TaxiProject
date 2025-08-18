import { DeviceInfo } from "@backend/grpc";
import { UserSession } from '../../../../domain/entities/UserSession';
import { Injectable } from "@nestjs/common";
import { IUserSessionSecurity } from "../../../../application/interface";

@Injectable()
export class UserSessionSecurity implements IUserSessionSecurity {
    async checkSuspiciousActivity(deviceInfo: DeviceInfo, userSession: UserSession): Promise<void> {
        const newDeviceOrIpDetected = userSession.checkNewIpOrDevice(deviceInfo.device, deviceInfo.location, deviceInfo.ipAddress)
        if(newDeviceOrIpDetected){
            //SEND MESSAGE TO INTEGRATION EVENT HANDLER
        }
    }
}