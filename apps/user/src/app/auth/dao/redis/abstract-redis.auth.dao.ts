export abstract class AbstractRedisAuthDao {
    storeRefreshToken(userId, token, expiration)

    getUserIdByRefreshToken(token)

    removeRefreshToken(token)
}