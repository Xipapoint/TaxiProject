import { NestjsInjectionToken, QueryRunnerManager, RequestStorageImplement, RequestStorageInstance, Transactional } from "@backend/nestjs";
import { Inject, OnModuleInit } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UserSession } from '../../domain/entities/UserSession';
import { UserSessionFactory } from '../../domain/factories/user-session/user-session.factory';
import { UserSessionRepository } from '../../domain/repository';
import { DeviceInfo, Id, TokenHash } from '../../domain/valueObjects';
import { CreateUserSessionCommand } from '../command/create-user-session-command/create-user-session-command';
import { ResponseOnCreateUserSession } from '../dto';
import { InjectionToken } from '../injection-token';
import { IJwtTokenService } from '../interface/jwt-token-service/jwt-token-service.interface';
import { RpcException } from "@nestjs/microservices";
import { QueryRunner } from 'typeorm';
import { UserSessionCacheRepository } from '../../domain/repository/UserSession/UserSessionCacheRepository';
import { IUserSessionService } from '../interface';

@CommandHandler(CreateUserSessionCommand)
export class CreateUserSessionCommandHandler implements ICommandHandler<CreateUserSessionCommand, ResponseOnCreateUserSession> {
    constructor(
        @Inject(InjectionToken.USER_SESSION_CACHE_REPOSITORY)
        private readonly userSessionCacheRepository: UserSessionCacheRepository,
        @Inject()
        private readonly userSessionFactory: UserSessionFactory,
        private readonly userSessionService: IUserSessionService,
    ) {}

    async execute(command: CreateUserSessionCommand): Promise<ResponseOnCreateUserSession> {
        try {
            const { deviceInfo, userData } = command.props
            const { device, location, ipAddress } = deviceInfo 
            const result = await this.userSessionService.createSession(userData, deviceInfo)
            const {accessToken, refreshToken} = result
             return {
                userData,
                tokenPair: {
                    refreshToken,
                    accessToken,
                }
            };
        } catch (error) {
            throw new RpcException(`Failed to create user session: ${error}`);
        }
    }
    
}