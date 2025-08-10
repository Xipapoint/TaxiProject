import { Transactional } from '@backend/nestjs';
import { RefreshTokensSessionCommand } from '../command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TokenPair } from '@backend/grpc';
import { UserSessionCacheRepository } from '../../domain/repository/UserSession/UserSessionCacheRepository';
import { Inject } from '@nestjs/common';
import { InjectionToken } from '../injection-token';
import { IJwtTokenService } from '../interface';
import { UserSessionFactory } from '../../domain/factories';
import { TokenHash, DeviceInfo, Id } from '../../domain/valueObjects';
import { UserSessionRepository } from '../../domain/repository/UserSession/UserSessionRepository';
import { IUserSessionService } from '../interface';
import { RpcException } from '@nestjs/microservices';

@CommandHandler(RefreshTokensSessionCommand)
export class RefreshTokensSessionCommandHandler implements ICommandHandler<RefreshTokensSessionCommand, TokenPair> {
        constructor(
            @Inject(InjectionToken.USER_SESSION_CACHE_REPOSITORY)
            private readonly userSessionCacheRepository: UserSessionCacheRepository,
            @Inject(InjectionToken.USER_SESSION_REPOSITORY)
            private readonly userSessionRepository: UserSessionRepository,
            @Inject()
            private readonly userSessionFactory: UserSessionFactory,
            @Inject(InjectionToken.JWT_TOKEN_SERVICE)
            private readonly jwtTokenService: IJwtTokenService,
            private readonly userSessionService: IUserSessionService,
        ) {}

    @Transactional()
    async execute(command: RefreshTokensSessionCommand): Promise<TokenPair> {
        const {deviceInfo, tokens, userData} = command.props
        const { device, location, ipAddress } = deviceInfo
        const { refreshToken, accessToken } = tokens

        const userSession = await this.userSessionCacheRepository.findById(userData.userId)
        if (!userSession) throw new RpcException('Session not found');

        const otherSession = await this.userSessionRepository.findByRefreshToken(refreshToken)

        const shouldInvalidate = userSession.shouldInvalidate(otherSession)
        if(shouldInvalidate){
            this.userSessionService.revokeSession(userSession)
            throw new RpcException('Invalid refresh token');
        }
        const {accessToken: sessionAccessToken, refreshToken: sessionRefreshToken} = await this.userSessionService.createSession(userData, deviceInfo)
        return {
            accessToken: sessionAccessToken,
            refreshToken: sessionRefreshToken
        }
        
    }
}