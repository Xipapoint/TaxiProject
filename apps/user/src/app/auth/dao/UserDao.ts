import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from '../entities/abstract.entity';

export class UserDao<T extends User> {
  constructor(private readonly repo: Repository<T>) {}

  findById(id: number) {
    return this.repo.findOne({ where: { id } as FindOptionsWhere<T> });
  }

  findByPhoneNumber(phoneNumber: string) {
    return this.repo.findOne({ where: { phoneNumber } as FindOptionsWhere<T> });
  }
}
