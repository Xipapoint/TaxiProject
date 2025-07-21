import { User } from "../../shared";

export abstract class AbstractAuthRepository<T extends User> {
    saveRefreshToken(userId, token)

    findRefreshToken(token)

    deleteRefreshToken(token)
}