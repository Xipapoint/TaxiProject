import { AggregateRoot } from "@nestjs/cqrs";
import { DeviceInfo, ExpiresAt, Id, TokenHash } from '../valueObjects';
import { SessionRevokedEvent } from '../event/session-revoked.event';

export type UserSessionEssentialProperties = Readonly<{
  readonly id: Id;
  readonly userId: Id;
  readonly refreshTokenHash: TokenHash;
  readonly deviceInfo: DeviceInfo;
  isRevoked: boolean;
  readonly expiresAt: ExpiresAt;
  version: number
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
  suspiciousActivityDetected: (userId: string, email: string, reason: string) => void
  newIpOrDeviceDetected: (otherDevice: DeviceInfo) => void
  checkNewIpOrDevice: (device: string, location: string, ipAddress: string) => boolean
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
  private version: number
  
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

  getVersion() {
    return this.version
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

  revoke(reason?: string) {
    this.setIsRevoked(true)

  };

  setVersion(version: number) {
    this.version = version
    this.apply(new SessionRevokedEvent(this.getId().getValue()))
  }

  shouldInvalidate(userSession: UserSession): boolean {
    const otherRefreshToken = userSession.getRefreshTokenHash()
    const equals = this.refreshTokenHash.matches(otherRefreshToken.getValue())

    const isOtherRevoked = userSession.getIsRevoked()
    const isOtherExpired = userSession.expiresAt.getValue() < new Date()

    const isSessionOld = (this.getVersion() % userSession.getVersion()) > 1

    if (!equals || isOtherRevoked || isOtherExpired)
      return isSessionOld ? true : this.shouldInvalidateByDevice(userSession.deviceInfo)
    else return false
  }

  shouldInvalidateByDevice(otherDevice: DeviceInfo): boolean {
    return this.deviceInfo.validate(otherDevice)
  }
  
  suspiciousActivityDetected(reason: string) {
    // CREATE NEW EVENT TO SEND EMAIL
  }

  newIpOrDeviceDetected(otherDevice: DeviceInfo) {
    // CREATE NEW EVENT TO SEND EMAIL
  }

  checkNewIpOrDevice(device: string, location: string, ipAddress: string) {
    return this.deviceInfo.validate(new DeviceInfo(device, location, ipAddress))
  }

}
