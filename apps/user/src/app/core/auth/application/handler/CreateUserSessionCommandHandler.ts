import { UserData } from "@backend/grpc";
import { ICommandHandler } from "@nestjs/cqrs";
import { CreateUserSessionCommand } from '../command/CreateUserSessionCommand/CreateUserSessionCommand';
import { Transactional } from "@backend/nestjs";
import { Inject } from "@nestjs/common";
import { InjectionToken } from '../InjectionToken';
import { UserSessionRepository } from '../../domain/repository';
import { UserSessionFactory } from '../../domain/factories/UserSession/UserSessionFactory';
import { DeviceInfo, Id, TokenHash } from '../../domain/valueObjects';
import { JwtTokenService } from '../interface/JwtTokenService';
import { ResponseOnCreateUserSession } from '../dto';

export class CreateUserSessionCommandHandler implements ICommandHandler<CreateUserSessionCommand, ResponseOnCreateUserSession> {
    constructor(
        @Inject(InjectionToken.USER_SESSION_REPOSITORY)
        private readonly userSessionRepository: UserSessionRepository,
        @Inject()
        private readonly userSessionFactory: UserSessionFactory,
        @Inject(InjectionToken.JWT_TOKEN_SERVICE)
        private readonly jwtTokenService: JwtTokenService
    ) {}
    @Transactional()
    async execute(command: CreateUserSessionCommand): Promise<ResponseOnCreateUserSession> {
        const { deviceInfo, userData } = command.props
        const { device, location, ipAddress } = deviceInfo 
        const token = this.jwtTokenService.signRefreshToken(userData, "7d")
        const userSession = await this.userSessionFactory.create({
            id: new Id(),
            userId: new Id(userData.userId),
            deviceInfo: new DeviceInfo(device, location, ipAddress),
            refreshToken: await TokenHash.create(token),
        })
    }
    
}