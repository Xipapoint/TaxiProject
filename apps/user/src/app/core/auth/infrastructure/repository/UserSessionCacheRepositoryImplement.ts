import { ConflictError, PostgresErrorCode } from "@backend/nestjs";
import { RedisClient } from "@backend/redis";
import { Inject, Injectable } from "@nestjs/common";
import { UserSession } from '../../domain/entities/UserSession';
import { UserSessionFactory } from '../../domain/factories';
import { UserSessionCacheRepository } from '../../domain/repository';
import { DeviceInfo, ExpiresAt, Id, TokenHash } from '../../domain/valueObjects';
import { UserSessionEntity } from '../entity/UserSessionEntity';

@Injectable()
export class UserSessionCacheRepositoryImplement implements UserSessionCacheRepository {
  @Inject() private readonly сlientFactory: UserSessionFactory;
  
  constructor(
    private readonly redisClient: RedisClient
  ) {}

  private getKey(id: string): string {
    return `user-session:${id}`;
  }

  async save(session: UserSession): Promise<void> {
    try {
      const key = this.getKey(session.getId().getValue());
      const expiresAt = session.getExpiresAt().getValue()
      const ttl = (expiresAt.getTime() - Date.now()) / 1000
      if (ttl > 0) {
        await this.redisClient.set(key, JSON.stringify(session.getRefreshTokenHash().getValue()), Math.ceil(ttl));
      }
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation)
        throw new ConflictError('Client with this phone number or email already exists');
      throw error
    }
  }

  async findById(id: string): Promise<UserSession | null> {
    const key = this.getKey(id);
    const data = await this.redisClient.get(key);
    if (!data) {
      return null;
    }
    return await this.entityToModel(JSON.parse(data));
  }
  
  async deleteById(id: string): Promise<void> {
    const key = this.getKey(id);
    await this.redisClient.del(key);
  }

  private modelToEntity(model: UserSession): UserSessionEntity {
    return {
        id: model.getId().getValue(),
        userId: model.getUserId().getValue(),
        refreshTokenHash: model.getRefreshTokenHash().getValue(),
        deviceInfo: model.getDeviceInfo().toValue(),
        isRevoked: model.getIsRevoked(),
        createdAt: model.getCreatedAt(),
        lastUsedAt: model.getLastUsedAt(),
        expiresAt: model.getExpiresAt().getValue()
    };
  }

  private async entityToModel(entity: UserSessionEntity): Promise<UserSession> {
    const { device, ipAddress, location } = entity.deviceInfo
    return this.сlientFactory.reconstitute({
        id: new Id(entity.id),
        userId: new Id(entity.userId),
        refreshTokenHash: await TokenHash.create(entity.refreshTokenHash),
        deviceInfo: new DeviceInfo(device, location, ipAddress),
        isRevoked: entity.isRevoked,
        createdAt: entity.createdAt,
        lastUsedAt: entity.lastUsedAt,
        expiresAt: ExpiresAt.createOneWeekFromNow(),
  });
  }
}