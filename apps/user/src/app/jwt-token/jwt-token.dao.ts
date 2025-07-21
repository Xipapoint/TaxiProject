import { RedisClient } from "@backend/redis";

export class JwtTokenDao {
    constructor(private readonly redisClient: RedisClient) {}

    async storeRefreshToken(userId: number, token: string, expiration = 2592000) {
        return this.redisClient.set(`${userId}`, token, expiration);
    }

    async removeRefreshToken(userId: number) {
        return await this.redisClient.del(userId.toString())
    }

    async getRefreshTokenByUserId(userId: number) {
        return await this.redisClient.get(userId.toString())
    }

}