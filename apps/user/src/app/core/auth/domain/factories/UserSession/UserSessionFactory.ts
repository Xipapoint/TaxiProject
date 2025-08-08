import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { UserSession, UserSessionProperties } from '../../entities/UserSession';
import { Id } from '../../valueObjects/Id/Id';
import { DeviceInfo, ExpiresAt, TokenHash } from '../../valueObjects';


type CreateUserSessionOptions = Readonly<{
  readonly id: Id;
  readonly userId: Id;
  readonly refreshToken: TokenHash;
  readonly deviceInfo: DeviceInfo;
}>;

export class UserSessionFactory {
  @Inject(EventPublisher) private readonly eventPublisher: EventPublisher;

  async create(options: CreateUserSessionOptions) {
    return this.eventPublisher.mergeObjectContext(
      new UserSession(
        {
          ...options,
          expiresAt: ExpiresAt.createOneWeekFromNow(),
          refreshTokenHash: options.refreshToken,
          isRevoked: false,
          createdAt: new Date(),
          lastUsedAt: new Date()
        }
      ),
    );
  }

  reconstitute(properties: UserSessionProperties) {
    return this.eventPublisher.mergeObjectContext(new UserSession(properties));
  }
}
