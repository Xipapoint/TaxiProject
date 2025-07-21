export abstract class AbstractRedisAuthDao {
    abstract storeRefreshToken(userId, token, expiration)

    abstract getUserIdByRefreshToken(token)

    abstract removeRefreshToken(token)
}