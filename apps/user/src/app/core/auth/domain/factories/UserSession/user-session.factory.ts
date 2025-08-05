import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { UserSession, UserSessionProperties } from '../../entities/UserSession';
import { Id } from '../../valueObjects/Id/Id';
import { TokenHash } from '../../valueObjects/TokenHash/TokenHash';
import { DeviceInfo } from '../../valueObjects/DeviceInfo/DeviceInfo';
import { ExpiresAt } from '../../valueObjects/ExpiresAt/ExpiresAt';

type CreateUserSessionOptions = Readonly<{
  readonly id: Id;
  readonly userId: Id;
  readonly refreshTokenHash: TokenHash;
  readonly deviceInfo: DeviceInfo;
  isRevoked: boolean;
}>;

export class UserSessionFactory {
  @Inject(EventPublisher) private readonly eventPublisher: EventPublisher;

  create(options: CreateUserSessionOptions) {
    return this.eventPublisher.mergeObjectContext(
      new UserSession(
        {
          ...options,
          expiresAt: ExpiresAt.createOneWeekFromNow(),
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
