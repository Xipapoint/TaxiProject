import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { UserSession, UserSessionProperties } from '../../entities/UserSession';
import { Id } from '../../valueObjects/Id/Id';
import { DeviceInfo, ExpiresAt, TokenHash } from '../../valueObjects';


type CreateUserSessionOptions = Readonly<{
  readonly userId: string;
  readonly refreshToken: string;
  readonly deviceInfo: { device: string, location: string, ipAddress: string };
  version: number
}>;

export class UserSessionFactory {
  @Inject(EventPublisher) private readonly eventPublisher: EventPublisher;

  async create(options: CreateUserSessionOptions) {
    return this.eventPublisher.mergeObjectContext(
      new UserSession(
        {
          ...options,
          id: new Id(),
          userId: new Id(options.userId),
          expiresAt: ExpiresAt.createOneWeekFromNow(),
          refreshTokenHash: await TokenHash.create(options.refreshToken),
          deviceInfo: new DeviceInfo(options.deviceInfo.device, options.deviceInfo.location, options.deviceInfo.ipAddress),
          isRevoked: false,
          createdAt: new Date(),
          lastUsedAt: new Date(),
        }
      ),
    );
  }

  reconstitute(properties: UserSessionProperties) {
    return this.eventPublisher.mergeObjectContext(new UserSession(properties));
  }
}
