import { AbstractCreateUserDto } from "../../shared/dto/request/create/base-create.dto";
import { User } from "../../shared/entities/abstract.entity";

export abstract class AbstractUserRepository<T extends User> {

  abstract findById(id: number): Promise<T | null>

  abstract findByPhoneNumber(phoneNumber: string): Promise<T | null>

  abstract create<K extends AbstractCreateUserDto>(data: K): Promise<T>

  abstract delete(id: number): Promise<void>
}
