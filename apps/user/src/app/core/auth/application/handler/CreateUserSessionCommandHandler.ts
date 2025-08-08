import { UserData } from "@backend/grpc";
import { ICommandHandler } from "@nestjs/cqrs";
import { CreateUserSessionCommand } from '../command/CreateUserSessionCommand/CreateUserSessionCommand';
import { Transactional } from "@backend/nestjs";
import { Inject } from "@nestjs/common";
import { InjectionToken } from '../InjectionToken';
import { UserSessionRepository } from '../../domain/repository';
import { UserSessionFactory } from '../../domain/factories/UserSession/UserSessionFactory';
import { DeviceInfo, Id, TokenHash } from '../../domain/valueObjects';
import { IJwtTokenService } from '../interface/JwtTokenService';
import { ResponseOnCreateUserSession } from '../dto';
import { UserSession } from '../../domain/entities/UserSession';

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
                // Попытка удаления, если вдруг сессия была создана и сохранена до ошибки
                await this.userSessionRepository.deleteById(session.id).catch(deleteError => {
                    // Логируем ошибку удаления, но основная ошибка важнее
                    console.error(`Failed to delete session ${session.id} from Redis during error cleanup`, deleteError);
                });
            }
      
            // Перебрасываем оригинальную ошибку
            console.error('Error during session creation:', error);
            throw new Error('Failed to create user session.');
        }
    }
    
}