import { Transactional } from '@backend/nestjs';
import { RefreshTokensSessionCommand } from '../command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TokenPair } from '@backend/grpc';
import { IUserSessionCacheRepository } from '../../domain/repository/UserSession/IUserSessionCacheRepository';
import { Inject } from '@nestjs/common';
import { InjectionToken } from '../injection-token';
import { IJwtTokenService } from '../interface';
import { UserSessionFactory } from '../../domain/factories';
import { TokenHash, DeviceInfo, Id } from '../../domain/valueObjects';
import { IUserSessionRepository } from '../../domain/repository/UserSession/IUserSessionRepository';
import { IUserSessionService } from '../interface';
import { RpcException } from '@nestjs/microservices';

@CommandHandler(RefreshTokensSessionCommand)
export class RefreshTokensSessionCommandHandler implements ICommandHandler<RefreshTokensSessionCommand, TokenPair> {
        constructor(
            @Inject(InjectionToken.USER_SESSION_CACHE_REPOSITORY)
            private readonly userSessionCacheRepository: IUserSessionCacheRepository,
            @Inject(InjectionToken.USER_SESSION_REPOSITORY)
            private readonly userSessionRepository: IUserSessionRepository,
            @Inject()
            private readonly userSessionFactory: UserSessionFactory,
            @Inject(InjectionToken.JWT_TOKEN_SERVICE)
            private readonly jwtTokenService: IJwtTokenService,
            private readonly userSessionService: IUserSessionService,
        ) {}

    @Transactional()
    async execute(command: RefreshTokensSessionCommand): Promise<TokenPair> {
        const {data, tokens} = command.props
        const { userData, deviceInfo } = data
        const { refreshToken } = tokens

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