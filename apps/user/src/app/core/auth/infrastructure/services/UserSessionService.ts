import { DeviceInfo, UserData } from "@backend/grpc";
import { Inject, Injectable } from "@nestjs/common";
import { InjectionToken } from '../../application/injection-token';
import { IUserSessionPersistanceService, IUserSessionTokensService } from '../../application/interface';
import { IUserSessionService } from '../../application/interface/user-session-service/user-session-service.interface';
import { UserSession } from '../../domain/entities/UserSession';
import { UserSessionFactory } from '../../domain/factories';
import { IUserSessionCacheRepository } from '../../domain/repository/UserSession/IUserSessionCacheRepository';
import { IUserSessionRepository } from '../../domain/repository/UserSession/IUserSessionRepository';
import { DeviceInfo as DeviceInfoVO, Id, TokenHash } from '../../domain/valueObjects';


@Injectable()
export class UserSessionService implements IUserSessionService {
    constructor(
        @Inject(InjectionToken.USER_SESSION_CACHE_REPOSITORY)
        private readonly userSessionCacheRepository: IUserSessionCacheRepository,
        @Inject(InjectionToken.USER_SESSION_REPOSITORY)
        private readonly userSessionRepository: IUserSessionRepository,
        @Inject()
        private readonly userSessionFactory: UserSessionFactory,
        @Inject(InjectionToken.USER_SESSION_PERSISTANCE_SERVICE)
        private readonly persistence: IUserSessionPersistanceService,

        @Inject(InjectionToken.TOKEN_SERVICE)
        private readonly tokensService: IUserSessionTokensService
    ) {}

    async createSession(userData: UserData, deviceInfo: DeviceInfo) {
        let session: UserSession
        try {
            const { accessToken, refreshToken } = this.tokensService.generateTokens(userData)
    
            session = await this.userSessionFactory.create({
                id: new Id(),
                userId: new Id(userData.userId),
                deviceInfo: new DeviceInfoVO(deviceInfo.device, deviceInfo.location, deviceInfo.ipAddress ),
                refreshToken: await TokenHash.create(refreshToken),
                version: 0,
            });
    
            await this.persistence.save(session);
    
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