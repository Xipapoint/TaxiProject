// import { Inject, Injectable } from '@nestjs/common';
// import { Repository } from 'typeorm';
// import { InjectionToken } from '../constants/InjectionToken';
// import { Client } from '../../core/user/infrastructure/entity/Client/Client';
// import { UserDao } from './UserDao';

// @Injectable()
// export class ClientDao extends UserDao<Client> {
//   constructor(
//     @Inject(InjectionToken.CLIENT_REPOSITORY) repo: Repository<Client>
//   ) {
//     super(repo);
//   }

//   createClient(data: Partial<Client>) {
//     const client = this.repo.create(data);
//     return this.repo.save(client);
//   }
// }
