import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from '../../core/user/infrastructure/entity/abstract.entity';

export class UserDao<T extends User> {
  constructor(readonly repo: Repository<T>) {}

  findById(id: number) {
    return this.repo.findOne({ where: { id } as FindOptionsWhere<T> });
  }

  findByPhoneNumber(phoneNumber: string) {
    return this.repo.findOne({ where: { phoneNumber } as FindOptionsWhere<T> });
  }


  findByName(name: string) {
    return this.repo.findOne({ where: { name } as FindOptionsWhere<T> });
  }
}
