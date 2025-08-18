import { TokenPair } from '@backend/grpc';
import { NestjsInjectionToken, QueryRunnerManager, Transactional } from '@backend/nestjs';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RpcException } from '@nestjs/microservices';
import { UserSessionFactory } from '../../domain/factories';
import { IUserSessionCacheRepository } from '../../domain/repository/UserSession/IUserSessionCacheRepository';
import { IUserSessionRepository } from '../../domain/repository/UserSession/IUserSessionRepository';
import { RefreshTokensSessionCommand } from '../command';
import { InjectionToken } from '../injection-token';
import { IJwtTokenService, IUserSessionService } from '../interface';

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
            @Inject(NestjsInjectionToken.QUERY_RUNNER_MANAGER)
            private readonly queryRunnerManager: QueryRunnerManager
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