import { Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectionToken } from '../constants/InjectionToken';
import { Client } from '../entities/Client';
import { UserDao } from './UserDao';

export class ClientDao extends UserDao<Client> {
  constructor(
    @Inject(InjectionToken.CLIENT_REPOSITORY) repo: Repository<Client>
  ) {
    super(repo);
  }
}
