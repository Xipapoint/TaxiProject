import { Inject, Injectable, OnModuleInit } from '@nestjs/common';


import { DataSource, EntityManager, QueryRunner } from 'typeorm';
import { ClientFactory, ClientImplement, ClientRepository, Email, PhoneNumber, UserId } from '../../domain';
import { ConflictError, PostgresErrorCode } from '@backend/nestjs';
import { ClientEntity } from '../entity/Client/Client';

@Injectable()
export class ClientRepositoryImplement implements OnModuleInit, ClientRepository {
  @Inject() private readonly сlientFactory: ClientFactory;
  private writeConnection: QueryRunner
  private readConnection: EntityManager;
  
  constructor(
    private readonly dataSource: DataSource
  ) {}

  onModuleInit() {
    this.writeConnection = this.dataSource.createQueryRunner();
    this.readConnection = this.dataSource.manager;
  }

  async save(data: ClientImplement | ClientImplement[]): Promise<void> {
    try {
      const models = Array.isArray(data) ? data : [data];
      const entities = models.map((model) => this.modelToEntity(model));
      await this.writeConnection.manager.getRepository(ClientEntity).save(entities);
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation)
        throw new ConflictError('Client with this phone number or email already exists');
      throw error
    }
  }

  private selectUserProfile() {
    return this.writeConnection.manager.createQueryBuilder().leftJoinAndSelect('client.user', 'user')
  }

  async findById(id: string): Promise<ClientImplement | null> {
    const entity = await this
      .selectUserProfile()
      .where('user.id = :id', {id})
      .getOne()
    return entity ? this.entityToModel(entity) : null;
  }

  async findByPhoneNumber(phoneNumber: string): Promise<ClientImplement | null> {
    const entity: ClientEntity | null = await this
      .selectUserProfile()
      .where('user.phoneNumber = :phoneNumber', {phoneNumber})
      .getOne()
    return entity ? this.entityToModel(entity) : null
  }

  async findByEmail(email: string): Promise<ClientImplement | null> {
    const entity: ClientEntity | null = await this
      .selectUserProfile()
      .where('user.email = :email', {email})
      .getOne()
    return entity ? this.entityToModel(entity) : null
  }

  private modelToEntity(model: ClientImplement): ClientEntity {
    const profile = model.getProfile()
    return {
      clientId: model.getClientIdValue(),
      userId: model.getUserIdValue(),
      user: {
        id: model.getUserIdValue(),
        firstName: profile.getFirstName(),
        lastName: profile.getLastName(),
        email: profile.getEmail().getValue(),
        phoneNumber: profile.getPhoneNumber().getValue(),
        dateOfBirth: profile.getDateOfBirth(),
        passwordHash: profile.getPasswordHash(),
        createdAt: profile.getCreatedAt(),
        updatedAt: profile.getUpdatedAt(),
      }
    };
  }

  private entityToModel(entity: ClientEntity): ClientImplement {
    const user = entity.user
    return this.сlientFactory.reconstitute({
      id: new UserId(user.id),
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: new PhoneNumber(user.phoneNumber),
      email: new Email(user.email),
      dateOfBirth: user.dateOfBirth,
      passwordHash: user.passwordHash,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    {
      clientId: new UserId(entity.clientId),
    }
  );
  }
}