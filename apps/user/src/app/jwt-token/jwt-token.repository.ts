import { JwtTokenDao } from "./jwt-token.dao";

export class JwtTokenRepository {
    constructor(private readonly jwtTokenDao: JwtTokenDao) {}
    
    async saveRefreshToken(userId: number, token: string, expiration = 2592000) {
        return this.jwtTokenDao.storeRefreshToken(userId, token, expiration);
    }

    async deleteRefreshToken(userId: number) {
        return this.jwtTokenDao.removeRefreshToken(userId);
    }

    async findByUserId(userId: number) {
        return this.jwtTokenDao.getRefreshTokenByUserId(userId);
    }
}