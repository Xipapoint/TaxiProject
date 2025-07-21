import { RefreshTokenData } from "./jwt-token.service";
import { JwtTokenDao } from "./jwt-token.dao";

export class JwtTokenRepository {
    constructor(private readonly jwtTokenDao: JwtTokenDao) {}
    
    async saveRefreshToken(userId: number, token: RefreshTokenData, expiration = 2592000) {
        return this.jwtTokenDao.storeRefreshToken(userId, token, expiration);
    }

    async deleteRefreshToken(userId: number) {
        return this.jwtTokenDao.removeRefreshToken(userId);
    }

    async findByUserId(userId: number) {
        const data = await this.jwtTokenDao.getRefreshTokenByUserId(userId);
        if (data)
            return JSON.parse(data) as RefreshTokenData;
        return null;
    }

    async updateLastUsed(userId: number): Promise<void> {
        await this.jwtTokenDao.updateLastUsed(userId);
    }
}