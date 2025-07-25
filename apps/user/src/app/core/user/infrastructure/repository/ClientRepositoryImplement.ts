import { Inject } from '@nestjs/common';

import {
  ENTITY_ID_TRANSFORMER,
  EntityId,
  writeConnection
} from '@backend/database';

import { Client } from '../entity';

import { ClientFactory, ClientImplement, ClientRepository, Email, PhoneNumber, UserId } from '../../domain';

export class ClientRepositoryImplement implements ClientRepository {
  @Inject() private readonly сlientFactory: ClientFactory;
  @Inject(ENTITY_ID_TRANSFORMER)

  async newId(): Promise<string> {
    return new EntityId().toString();
  }

  async save(data: ClientImplement | ClientImplement[]): Promise<void> {
    const models = Array.isArray(data) ? data : [data];
    const entities = models.map((model) => this.modelToEntity(model));
    await writeConnection.manager.getRepository(Client).save(entities);
  }

  async findById(id: string): Promise<ClientImplement | null> {
    const entity = await writeConnection.manager
      .getRepository(Client)
      .findOneBy({ id });
    return entity ? this.entityToModel(entity) : null;
  }

  async findByPhoneNumber(phoneNumber: string): Promise<ClientImplement[]> {
    const entities = await writeConnection.manager
      .getRepository(Client)
      .findBy({ phoneNumber });
    return entities.map((entity) => this.entityToModel(entity));
  }

  async findByEmail(email: string): Promise<ClientImplement[]> {
    const entities = await writeConnection.manager
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