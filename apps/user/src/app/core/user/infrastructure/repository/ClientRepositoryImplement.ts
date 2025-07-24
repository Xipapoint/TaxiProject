import { Inject } from '@nestjs/common';

import {
  EntityId,
  EntityIdTransformer,
  ENTITY_ID_TRANSFORMER,
  writeConnection,
} from '@backend/database';

import { Client } from '../entity';

import { ClientRepository, Email, PhoneNumber, UserId } from '../../domain';
import { ClientImplement, ClientProperties } from '../../domain';
import { ClientFactory } from '../../domain';

export class ClientRepositoryImplement implements ClientRepository {
  @Inject() private readonly сlientFactory: ClientFactory;
  @Inject(ENTITY_ID_TRANSFORMER)
  private readonly entityIdTransformer: EntityIdTransformer;

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
      .findOneBy({ id: this.entityIdTransformer.to(id) });
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
    const properties = JSON.parse(JSON.stringify(model)) as ClientProperties;
    return {
      ...properties,
      id: this.entityIdTransformer.to(properties.id.getValue()),
      phoneNumber: typeof properties.phoneNumber === 'string' ? properties.phoneNumber : model.getPhoneNumber().getValue(),
      email: typeof properties.email === 'string' ? properties.email : model.getEmail().getValue(),
      createdAt: properties.createdAt,
      updatedAt: properties.updatedAt,
    };
  }

  private entityToModel(entity: Client): ClientImplement {
    return this.сlientFactory.reconstitute({
      ...entity,
      id: new UserId(this.entityIdTransformer.from(entity.id)),
      phoneNumber: new PhoneNumber(entity.phoneNumber),
      email: new Email(entity.phoneNumber),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}