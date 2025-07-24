import { AbstractCreateUserDto } from "../../core/user/infrastructure/interface/dto/request/create/base-create.dto";
import { User } from "../../core/user/infrastructure/entity/abstract.entity";

export abstract class AbstractUserRepository<T extends User> {

  abstract findById(id: number): Promise<T | null>

  abstract findByPhoneNumber(phoneNumber: string): Promise<T | null>

  abstract create<K extends AbstractCreateUserDto>(data: K): Promise<T>

  abstract delete(id: number): Promise<void>
}
