import { Transactional } from "@backend/nestjs";
import { Inject } from "@nestjs/common";
import { ICommandHandler } from "@nestjs/cqrs";
import { UserSession } from '../../domain/entities/UserSession';
import { UserSessionFactory } from '../../domain/factories/UserSession/UserSessionFactory';
import { UserSessionRepository } from '../../domain/repository';
import { DeviceInfo, Id, TokenHash } from '../../domain/valueObjects';
import { CreateUserSessionCommand } from '../command/CreateUserSessionCommand/CreateUserSessionCommand';
import { ResponseOnCreateUserSession } from '../dto';
import { InjectionToken } from '../InjectionToken';
import { IJwtTokenService } from '../interface/JwtTokenService';

export class CreateUserSessionCommandHandler implements ICommandHandler<CreateUserSessionCommand, ResponseOnCreateUserSession> {
    constructor(
        @Inject(InjectionToken.USER_SESSION_REPOSITORY)
        private readonly userSessionRepository: UserSessionRepository,
        @Inject()
        private readonly userSessionFactory: UserSessionFactory,
        @Inject(InjectionToken.JWT_TOKEN_SERVICE)
        private readonly jwtTokenService: IJwtTokenService
    ) {}
    @Transactional()
    async execute(command: CreateUserSessionCommand): Promise<ResponseOnCreateUserSession> {
        let userSession: UserSession | undefined;
        try {
            const { deviceInfo, userData } = command.props
            const { device, location, ipAddress } = deviceInfo 
            const refreshToken = this.jwtTokenService.signRefreshToken(userData, "7d")
            userSession = await this.userSessionFactory.create({
                id: new Id(),
                userId: new Id(userData.userId),
                deviceInfo: new DeviceInfo(device, location, ipAddress),
                refreshToken: await TokenHash.create(refreshToken),
            })
            const accessToken = this.jwtTokenService.signAccessToken(userData, "30m")
            await this.userSessionRepository.save(userSession);
            return {
                userData,
                tokenPair: {
                    refreshToken, accessToken
                }
            }
        } catch (error) {
            if (userSession) {
                const id = userSession.getId().getValue()
                await this.userSessionRepository.deleteById(id).catch(deleteError => {
                    console.error(`Failed to delete session ${id} from Redis during error cleanup`, deleteError);
                });
            }
      
            console.error('Error during session creation:', error);
            throw new Error('Failed to create user session.');
        }
    }
    
}