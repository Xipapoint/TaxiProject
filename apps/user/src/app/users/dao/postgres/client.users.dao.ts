import { Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectionToken } from '../../../auth/constants/InjectionToken';
import { Client } from '../../../core/user/infrastructure/entity/Client/Client';
import { AbstractUserDao } from './abstract.users.dao';
import { CreateClientDto } from '../../../core/user/infrastructure/interface/dto/request/create/create-client.dto';

export class ClientDao extends AbstractUserDao<Client> {

  constructor(
    @Inject(InjectionToken.CLIENT_REPOSITORY) repo: Repository<Client>
  ) {
    super(repo);
  }

  async findById(id: number): Promise<Client | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByPhoneNumber(phoneNumber: string): Promise<Client | null> {
    return this.repo.findOne({ where: { phoneNumber } });
  }

  async create(data: CreateClientDto): Promise<Client> {
    return this.repo.save(data)
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id)
  }
}
