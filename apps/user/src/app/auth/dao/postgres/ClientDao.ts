import { Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectionToken } from '../../constants/InjectionToken';
import { Client } from '../../entities/Client';
import { AbstractUserDao } from './abstract.dao';

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

  async create<CreateClientDto>(data: CreateClientDto): Promise<Client> {
    try {
      
      return this.repo.save(data)
    } catch (error) {
      
    }
  }

  delete(id: number): Promise<void> {
    
  }
}
