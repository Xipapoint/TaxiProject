import { AggregateRoot } from "@nestjs/cqrs";
import { Id } from '../valueObjects/Id/Id';
import { TokenHash } from '../valueObjects/TokenHash/TokenHash';
import { DeviceInfo } from '../valueObjects/DeviceInfo/DeviceInfo';
import { TokenPair } from '../dto/TokenPair/TokenPair';

export type UserEssentialProperties = Readonly<{
  readonly id: Id;
  readonly userId: Id;
  readonly refreshTokenHash: TokenHash;
  readonly deviceInfo: DeviceInfo;
  isRevoked: boolean;
  readonly createdAt: Date;
  readonly expiresAt: Date;
  lastUsedAt: Date;
}>;

export type UserOptionalProperties = Readonly<
  Partial<{
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
  }>
>;

export type UserProperties = UserEssentialProperties &
  Required<UserOptionalProperties>;

export interface IUser {
  compareId: (id: string) => boolean;
  revoke: (id: string) => void
  shouldInvalidate: (refreshToken: UserSession) => boolean
  shouldInvalidateByDevice: (otherDevice: DeviceInfo) => boolean
  delete: () => void;
  commit: () => void;
}

export abstract class UserSession extends AggregateRoot implements IUser {
  private readonly id: Id;
  private readonly userId: Id;
  private readonly refreshTokenHash: TokenHash;
  private readonly deviceInfo: DeviceInfo;
  private isRevoked: boolean;
  private readonly createdAt: Date;
  private readonly expiresAt: Date;
  private lastUsedAt: Date;

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

  getExpiresAt(): Date {
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
  
  constructor() {
    super();
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
    const isOtherExpired = userSession.expiresAt < new Date()
    const equals = this.refreshTokenHash.equals(otherRefreshToken)
    if (!equals || isOtherRevoked || isOtherExpired)
      return true
    else return false

  }

  shouldInvalidateByDevice(otherDevice: DeviceInfo): boolean {
    return this.deviceInfo.validate(otherDevice)
  }

  abstract delete(): void;
}
