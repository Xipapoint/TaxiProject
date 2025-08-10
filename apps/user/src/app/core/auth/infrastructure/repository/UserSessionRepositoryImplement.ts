import { PostgresErrorCode, ConflictError } from "@backend/nestjs";
import { Injectable, OnModuleInit, Inject } from "@nestjs/common";

import { QueryRunner, EntityManager, DataSource } from "typeorm";
import { UserSessionFactory } from '../../domain/factories';
import { UserSession } from '../../domain/entities/UserSession';
import { UserSessionEntity } from '../entity/UserSessionEntity';
import { DeviceInfo, ExpiresAt, Id, TokenHash } from '../../domain/valueObjects';
import { UserSessionRepository } from '../../domain/repository';

@Injectable()
export class UserSessionRepositoryImplement implements OnModuleInit, UserSessionRepository {
  @Inject() private readonly userSessionFactory: UserSessionFactory;
  private writeConnection: QueryRunner
  private readConnection: EntityManager;
  
  constructor(
    private readonly dataSource: DataSource
  ) {}

  onModuleInit() {
    this.writeConnection = this.dataSource.createQueryRunner();
    this.readConnection = this.dataSource.manager;
  }

  async save(data: UserSession | UserSession[]): Promise<void> {
    try {
      const models = Array.isArray(data) ? data : [data];
      const entities = models.map((model) => this.modelToEntity(model));
      await this.writeConnection.manager.getRepository(UserSessionEntity).save(entities);
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation)
        throw new ConflictError('Client with this phone number or email already exists');
      throw error
    }
  }

  private createQueryBuilder() {
    return this.writeConnection.manager.createQueryBuilder()
  }

  async findById(id: string): Promise<UserSession | null> {
    const entity = await this
      .createQueryBuilder()
      .where('id = :id', {id})
      .getOne()
    return entity ? await this.entityToModel(entity) : null;
  }

  async findByRefreshToken(refreshToken: string): Promise<UserSession | null> {
    const entity = await this
      .createQueryBuilder()
      .where('refreshToken = :refreshToken', {refreshToken})
      .getOne()
    return entity ? await this.entityToModel(entity) : null;
  }

  async deleteById(id: string): Promise<void> {
    this
      .createQueryBuilder()
      .where('id = :id', {id})
      .delete()
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
        expiresAt: model.getExpiresAt().getValue(),
        version: model.getVersion()
    };
  }

  private async entityToModel(entity: UserSessionEntity): Promise<UserSession> {
    const { device, ipAddress, location } = entity.deviceInfo
    return this.userSessionFactory.reconstitute({
        id: new Id(entity.id),
        userId: new Id(entity.userId),
        refreshTokenHash: await TokenHash.create(entity.refreshTokenHash),
        deviceInfo: new DeviceInfo(device, location, ipAddress),
        isRevoked: entity.isRevoked,
        createdAt: entity.createdAt,
        lastUsedAt: entity.lastUsedAt,
        expiresAt: ExpiresAt.createOneWeekFromNow(),
        version: entity.version,
  });
  }
}