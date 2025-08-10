import { UserData, DeviceInfo } from "@backend/grpc";
import { Injectable, Inject } from "@nestjs/common";
import { InjectionToken } from '../../application/injection-token';
import { UserSessionFactory } from '../../domain/factories';
import { UserSessionCacheRepository } from '../../domain/repository/UserSession/UserSessionCacheRepository';
import { UserSession } from '../../domain/entities/UserSession';
import { DeviceInfo as DeviceInfoVO, Id, TokenHash } from '../../domain/valueObjects';
import { UserSessionRepository } from '../../domain/repository/UserSession/UserSessionRepository';
import { IUserSessionService } from '../../application/interface/user-session-service/user-session-service.interface';
import { IJwtTokenService } from '../../application/interface/jwt-token-service/jwt-token-service.interface';


@Injectable()
class UserSessionService implements IUserSessionService {
    constructor(
        @Inject(InjectionToken.USER_SESSION_CACHE_REPOSITORY)
        private readonly userSessionCacheRepository: UserSessionCacheRepository,
        @Inject(InjectionToken.USER_SESSION_REPOSITORY)
        private readonly userSessionRepository: UserSessionRepository,
        @Inject()
        private readonly userSessionFactory: UserSessionFactory,
        @Inject(InjectionToken.JWT_TOKEN_SERVICE)
        private readonly jwtTokenService: IJwtTokenService,
    ) {}

    async createSession(userData: UserData, deviceInfo: DeviceInfo) {
        let session: UserSession
        try {
            const refreshToken = this.jwtTokenService.signRefreshToken(userData, "7d");
    
            const hashedToken = await TokenHash.create(refreshToken);
    
            session = await this.userSessionFactory.create({
                id: new Id(),
                userId: new Id(userData.userId),
                deviceInfo: new DeviceInfoVO(deviceInfo.device, deviceInfo.location, deviceInfo.ipAddress ),
                refreshToken: hashedToken,
                version: 0,
            });
    
            const accessToken = this.jwtTokenService.signAccessToken(userData, "30m");
    
            await this.userSessionCacheRepository.save(session);
    
            return {accessToken, refreshToken};
            
        } catch (error) {
            try {
                await this.userSessionRepository.deleteById(session.getId().getValue());
            } catch (cleanupErr) {
                console.error('Cleanup failed after createUserSession error', cleanupErr);
            }
            throw error;
        }
    }

    async revokeSession(session: UserSession, reason?: string) {
        session.revoke(reason);
        await this.userSessionRepository.save(session);
        await this.userSessionCacheRepository.deleteById(session.getId().getValue())
    }
}