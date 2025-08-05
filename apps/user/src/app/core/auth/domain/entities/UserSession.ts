import { AggregateRoot } from "@nestjs/cqrs";
import { DeviceInfo } from '../valueObjects/DeviceInfo/DeviceInfo';
import { Id } from '../valueObjects/Id/Id';
import { TokenHash } from '../valueObjects/TokenHash/TokenHash';
import { ExpiresAt } from '../valueObjects/ExpiresAt/ExpiresAt';

export type UserSessionEssentialProperties = Readonly<{
  readonly id: Id;
  readonly userId: Id;
  readonly refreshTokenHash: TokenHash;
  readonly deviceInfo: DeviceInfo;
  isRevoked: boolean;
  readonly expiresAt: ExpiresAt;
}>;

export type UserSessionOptionalProperties = Readonly<
Partial<{
    lastUsedAt: Date;
    createdAt: Date;
  }>
>;

export type UserSessionProperties = UserSessionEssentialProperties &
  Required<UserSessionOptionalProperties>;

export interface IUser {
  compareId: (id: string) => boolean;
  revoke: (id: string) => void
  shouldInvalidate: (refreshToken: UserSession) => boolean
  shouldInvalidateByDevice: (otherDevice: DeviceInfo) => boolean
  commit: () => void;
}

export class UserSession extends AggregateRoot implements IUser {
  private readonly id: Id;
  private readonly userId: Id;
  private readonly refreshTokenHash: TokenHash;
  private readonly deviceInfo: DeviceInfo;
  private isRevoked: boolean;
  private readonly createdAt: Date;
  private readonly expiresAt: ExpiresAt;
  private lastUsedAt: Date;
  
  constructor(properties: UserSessionProperties) {
    super();
    Object.assign(this, properties)
  }
  
  getId(): Id {
    return this.id;
  }

  getUserId(): Id {
    return this.userId;
  }

  getRefreshTokenHash(): TokenHash {
    return this.refreshTokenHash;
  }

  getDeviceInfo(): DeviceInfo {
    return this.deviceInfo;
  }

  getIsRevoked(): boolean {
    return this.isRevoked;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getExpiresAt(): ExpiresAt {
    return this.expiresAt;
  }

  getLastUsedAt(): Date {
    return this.lastUsedAt;
  }

  setIsRevoked(isRevoked: boolean): void {
    this.isRevoked = isRevoked;
  }

  setLastUsedAt(lastUsedAt: Date): void {
    this.lastUsedAt = lastUsedAt;
  }
  compareId(id: string): boolean {
    return this.id.equals(new Id(id));
  }

  revoke() {
    this.setIsRevoked(true)
  };

  shouldInvalidate(userSession: UserSession): boolean {
    const otherRefreshToken = userSession.getRefreshTokenHash()
    const isOtherRevoked = userSession.getIsRevoked()
    const isOtherExpired = userSession.expiresAt.getValue() < new Date()
    const equals = this.refreshTokenHash.equals(otherRefreshToken)
    if (!equals || isOtherRevoked || isOtherExpired)
      return true
    else return false

  }

  shouldInvalidateByDevice(otherDevice: DeviceInfo): boolean {
    return this.deviceInfo.validate(otherDevice)
  }

}
