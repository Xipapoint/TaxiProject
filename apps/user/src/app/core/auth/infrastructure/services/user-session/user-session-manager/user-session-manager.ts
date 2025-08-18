import { UserData, DeviceInfo, TokenPair } from "@backend/grpc";
import { UserSession } from '../../../../domain/entities/UserSession';
import { Inject, Injectable } from "@nestjs/common";
import { IUserSessionManager, IUserSessionPersistanceService, IUserSessionTokensService } from '../../../../application/interface';
import { UserSessionFactory } from '../../../../domain/factories';
import { InjectionToken } from '../../../../application/injection-token';

@Injectable()
export class UserSessionManager implements IUserSessionManager {
  constructor(
    @Inject()
    private readonly userSessionFactory: UserSessionFactory,
    @Inject(InjectionToken.USER_SESSION_PERSISTANCE_SERVICE)
    private readonly persistence: IUserSessionPersistanceService,

    @Inject(InjectionToken.TOKEN_SERVICE)
    private readonly tokensService: IUserSessionTokensService
  ) {}

  private async buildSession(
    userData: UserData,
    deviceInfo: DeviceInfo,
    refreshToken: string,
    version: number
  ): Promise<UserSession> {
    const session = this.userSessionFactory.create({
      userId: userData.userId,
      deviceInfo: {
        device: deviceInfo.device,
        location: deviceInfo.location,
        ipAddress: deviceInfo.ipAddress,
      },
      refreshToken: refreshToken,
      version,
    });
    return session;
  }

  async createSession(userData: UserData, deviceInfo: DeviceInfo) {
    const version = 0;
    const { accessToken, refreshToken } =
      this.tokensService.generateTokens(userData);

    const session = await this.buildSession(
      userData,
      deviceInfo,
      refreshToken,
      version
    );

    await this.persistence.save(session);

    return { accessToken, refreshToken };
  }

  async refreshSession(
    userData: UserData,
    deviceInfo: DeviceInfo,
    previousVersion: number
  ) {
    let session: UserSession;
    try {
      const { accessToken, refreshToken } =
        this.tokensService.generateTokens(userData);

      session = await this.buildSession(
        userData,
        deviceInfo,
        refreshToken,
        ++previousVersion
      );

      await this.persistence.save(session);

      return { accessToken, refreshToken };
    } catch (error) {
      if (session) {
        await this.persistence.deleteById(session.getId().getValue());
      }
      throw error;
    }
  }
  async revokeSession(session: UserSession, reason?: string) {
    try {
      session.revoke(reason);
      await this.persistence.saveInDb(session);
      await this.persistence.deleteById(
        session.getId().getValue()
      );
    } catch (error) {
      throw error;
    }
  }
}