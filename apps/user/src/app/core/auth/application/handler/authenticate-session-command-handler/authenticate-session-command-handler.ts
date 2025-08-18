import { TokenPair } from "@backend/grpc";
import { NestjsInjectionToken, QueryRunnerManager, Transactional } from "@backend/nestjs";
import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RpcException } from "@nestjs/microservices";
import { IUserSessionCacheRepository, IUserSessionRepository } from '../../../domain/repository';
import { AuthenticateSessionCommand } from '../../command';
import { InjectionToken } from '../../injection-token';
import { IUserSessionSecurity, IUserSessionTokensService, IUserSessionVerifier } from '../../interface';


@CommandHandler(AuthenticateSessionCommand)
export class AuthenticateSessionCommandHandler implements ICommandHandler<AuthenticateSessionCommand, TokenPair> {
    constructor(
        @Inject(NestjsInjectionToken.QUERY_RUNNER_MANAGER)
        private readonly queryRunnerManager: QueryRunnerManager,
        @Inject(InjectionToken.USER_SESSION_CACHE_REPOSITORY)
        private readonly userSessionCacheRepository: IUserSessionCacheRepository,
        @Inject(InjectionToken.USER_SESSION_REPOSITORY)
        private readonly userSessionRepository: IUserSessionRepository,
        @Inject(InjectionToken.USER_SESSION_VERIFIER)
        private readonly userSessionVerifier: IUserSessionVerifier,
        @Inject(InjectionToken.USER_SESSION_SECURITY)
        private readonly userSessionSecurity: IUserSessionSecurity,
        @Inject(InjectionToken.TOKEN_SERVICE)
        private readonly tokenService: IUserSessionTokensService
    ) {
        
    }
    @Transactional()
    //TODO: CREATE AUTHINTICATE METHOD TO CHECK WETHER USER AUTHENTICATED - RETURN TRUE OR FALSE. 
    // IN CASE OF ERROR OUTPUT SHOULD BE WITH ERROR MESSAGE(CHECK GRPC LIBRARY)
    async execute(command: AuthenticateSessionCommand): Promise<TokenPair> {
        const { data, tokens } = command.props
        const { userData, deviceInfo } = data
        const { refreshToken, accessToken } = tokens

        const userSession = await this.userSessionCacheRepository.findById(userData.userId)
        if (!userSession) throw new RpcException('Session not found');

        const otherSession = await this.userSessionRepository.findByRefreshToken(refreshToken)
        if (!otherSession) throw new RpcException('Invalid refresh token');

        await Promise.all(
            [
                this.userSessionVerifier.verifyByUserSessionDevice(otherSession, userData, userSession),
                this.userSessionVerifier.verifyByUserSession(otherSession, userSession),
                this.userSessionSecurity.checkSuspiciousActivity(deviceInfo, userSession)
            ]
        )
        const tokenPair = await this.tokenService.verifyTokens({ accessToken, refreshToken })
        if(!tokenPair)
            throw new RpcException("Something went wrong")
        return tokenPair
        
    }
}