// import { RedisClient } from "@backend/redis";
// import { RefreshTokenData } from './jwt-token.service';

// export class JwtTokenDao {
//     constructor(private readonly redisClient: RedisClient) {}

//     async storeRefreshToken(userId: number, token: RefreshTokenData, expiration = 2592000) {
//         return this.redisClient.set(`${userId}`, JSON.stringify(token), expiration);
//     }

//     async removeRefreshToken(userId: number) {
//         return await this.redisClient.del(userId.toString())
//     }

//     async getRefreshTokenByUserId(userId: number) {
//         return await this.redisClient.get(userId.toString())
//     }

//     async updateLastUsed(userId: number) {
//         const token = await this.getRefreshTokenByUserId(userId)
//         const data = JSON.parse(token) as RefreshTokenData;
//         data.lastUsedAt = new Date();
//         return this.storeRefreshToken(userId, data);
//     }
// }