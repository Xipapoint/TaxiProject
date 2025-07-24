import { LoginUserDto, User } from "../../shared";
import { AbstractCreateUserDto } from '../../core/user/infrastructure/interface/dto/request/create/base-create.dto';

export abstract class AbstractAuthService<T extends User> {
    abstract register<K extends AbstractCreateUserDto>(data: K): Promise<T>;

    abstract login(data: LoginUserDto): Promise<T>

    // logOut()

    // refresh()
    
    // invalidateSession()

    // saveBankCard()
}