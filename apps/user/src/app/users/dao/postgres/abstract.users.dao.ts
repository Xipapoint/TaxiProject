import { Repository } from 'typeorm';
import { User } from '../../../shared/entities/abstract.entity';
import { AbstractCreateUserDto } from '../../../shared/dto/request/create/base-create.dto';

export abstract class AbstractUserDao<T extends User> {
  constructor(protected readonly repo: Repository<T>) {}

  abstract findById(id: number): Promise<T | null>

  abstract findByPhoneNumber(phoneNumber: string): Promise<T | null>

  abstract create<K extends AbstractCreateUserDto>(data: K): Promise<T>

  abstract delete(id: number): Promise<void>
}
