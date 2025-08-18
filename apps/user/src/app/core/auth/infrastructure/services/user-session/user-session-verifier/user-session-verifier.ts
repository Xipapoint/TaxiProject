import { UserSession } from '../../../../domain/entities/UserSession';
import { DeviceInfo as DeviceInfoVO } from "../../../../domain/valueObjects";

import { Inject, Injectable } from '@nestjs/common';
import { RpcException } from "@nestjs/microservices";
import { InjectionToken } from '../../../../application/injection-token';
import { IUserSessionService, IUserSessionVerifier } from '../../../../application/interface';
import { UserData } from '@backend/grpc';

@Injectable()
export class SessionVerifier implements IUserSessionVerifier {
    і
    constructor(
        @Inject(InjectionToken.USER_SESSION_SERVICE)
        private readonly userSessionService: IUserSessionService
    ) {}
    async verifyByUserSessionDevice(otherSession: UserSession, userData: UserData, userSession: UserSession): Promise<void> {
        const shouldInvalidateBySessionDevice = userSession.shouldInvalidateByDevice(otherSession.getDeviceInfo())
        if(shouldInvalidateBySessionDevice){
            //CREATE CONSTANTS REASONS TO REVOKE ALL USER TOKENS
            const reason = 'Suspicious device detected'
            this.userSessionService.revokeSession(userSession, reason)

            userSession.suspiciousActivityDetected(userData.userId)

            //TODO: CREATE CUSTOM ERRORS TO HANDLE ERRORS IN MORE APPROPRIATE WAY AND GIVE MORE INFORMATIONS TO USER
            throw new RpcException(reason);
        }
    }

    async verifyByUserSession(otherSession: UserSession, userSession: UserSession): Promise<void> {
        const shouldInvalidate = userSession.shouldInvalidate(otherSession)
        if(shouldInvalidate) {
            //CREATE CONSTANTS REASONS TO REVOKE ALL USER TOKENS
            const reason = 'Suspicious device detected'
            this.userSessionService.revokeSession(userSession, reason)

            //TODO: CREATE CUSTOM ERRORS TO HANDLE ERRORS IN MORE APPROPRIATE WAY AND GIVE MORE INFORMATIONS TO USER
            throw new RpcException(reason);
        }
    }
}