import { Inject, Injectable, OnModuleInit } from '@nestjs/common';

import { Client } from '../entity';

import { DataSource, EntityManager, QueryRunner } from 'typeorm';
import { ClientFactory, ClientImplement, ClientRepository, Email, PhoneNumber, UserId } from '../../domain';
import { ConflictError, PostgresErrorCode } from '@backend/nestjs';

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
      await this.writeConnection.manager.getRepository(Client).save(entities);
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation)
        throw new ConflictError('Client with this phone number or email already exists');
      throw error
    }
  }

  async findById(id: string): Promise<ClientImplement | null> {
    const entity = await this.writeConnection.manager
      .getRepository(Client)
      .findOneBy({ id });
    return entity ? this.entityToModel(entity) : null;
  }

  async findByPhoneNumber(phoneNumber: string): Promise<ClientImplement[]> {
    const entities = await this.writeConnection.manager
      .getRepository(Client)
      .findBy({ phoneNumber });
    return entities.map((entity) => this.entityToModel(entity));
  }

  async findByEmail(email: string): Promise<ClientImplement[]> {
    const entities = await this.writeConnection.manager
      .getRepository(Client)
      .findBy({ email });
    return entities.map((entity) => this.entityToModel(entity));
  }

  private modelToEntity(model: ClientImplement): Client {
    return {
      id: model.getId().getValue(),
      firstName: model.getFirstName(),
      lastName: model.getLastName(),
      email: model.getEmail().getValue(),
      phoneNumber: model.getPhoneNumber().getValue(),
      dateOfBirth: model.getDateOfBirth(),
      passwordHash: model.getPasswordHash(),
      createdAt: model.getCreatedAt(),
      updatedAt: model.getUpdatedAt(),
    };
  }

  private entityToModel(entity: Client): ClientImplement {
    return this.сlientFactory.reconstitute({
      id: new UserId(entity.id),
      firstName: entity.firstName,
      lastName: entity.lastName,
      phoneNumber: new PhoneNumber(entity.phoneNumber),
      email: new Email(entity.email),
      dateOfBirth: entity.dateOfBirth,
      passwordHash: entity.passwordHash,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}