import { JwtService } from '@nestjs/jwt';
import { JwtTokenRepository } from './jwt-token.repository';
import { TokenPayload } from '../auth/dto/TokenPayloadDto';


export interface DeviceInfo {
  device: string;
  location: string;
  userAgent: string;
  ipAddress: string;
}

export interface RefreshTokenData {
  id: string;
  userId: number;
  token: string;
  device: string;
  location: string;
  userAgent: string;
  ipAddress: string;
  createdAt: Date;
  expiresAt: Date;
  lastUsedAt: Date;
  isRevoked: boolean;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export class JwtTokenService {
    constructor(
        private readonly jwtTokenRepository: JwtTokenRepository,
        private readonly jwtService: JwtService
    
    )  {}

    private shouldValidateDevice(storedToken: RefreshTokenData, currentDevice: DeviceInfo): boolean {
        // Проверяем на подозрительную активность
        // Например, если IP сильно отличается или устройство кардинально другое
        
        // Простая проверка на совпадение устройства
        const deviceChanged = storedToken.device !== currentDevice.device;
        const locationChanged = storedToken.location !== currentDevice.location;
        
        // Если и устройство и локация изменились - это подозрительно
        return deviceChanged && locationChanged;
    }

    async signAccessToken(payload: TokenPayload) {
        return this.jwtService.sign(payload);
    }

    async signRefreshToken(payload: TokenPayload) {
        const token = this.jwtService.sign(payload);
        await this.jwtTokenRepository.saveRefreshToken(payload.userId, token)
        return token;
    }

    async refreshTokens(userId: number, refreshToken: string, deviceInfo: DeviceInfo): Promise<TokenPair> {
        // Находим refresh token в базе
        const storedToken = await this.jwtTokenRepository.findByUserId(userId);

        const equels = storedToken.token === refreshToken;

        if (!equels || storedToken.isRevoked || storedToken.expiresAt < new Date()) {
        // Если токен недействителен, удаляем все токены пользователя (защита от атак)
        if (storedToken) {
            await this.revokeAllUserTokens(storedToken.userId);
        }
        throw new Error('Invalid refresh token');
        }

        // Проверяем устройство и местоположение (дополнительная безопасность)
        if (this.shouldValidateDevice(storedToken, deviceInfo)) {
            await this.revokeAllUserTokens(storedToken.userId);
            throw new Error('Suspicious activity detected. All sessions revoked.');
        }

        // Обновляем время последнего использования
        await this.refreshTokenRepository.updateLastUsed(storedToken.id);

        // Получаем пользователя для создания нового токена
        const userRepository = new UserRepository(new PostgresUserDao(), this.redisDao);
        const user = await userRepository.findById(storedToken.userId);
        
        if (!user) {
        throw new Error('User not found');
        }

        // Создаем новую пару токенов
        const newTokenPair = await this.createTokenPair(
            user.id,
            user.email,
            user.roles,
            deviceInfo
        );

        // Отзываем старый refresh token
        await this.refreshTokenRepository.revoke(storedToken.id);

        return newTokenPair;
    }

    async revokeToken(refreshToken: string): Promise<void> {
        const storedToken = await this.refreshTokenRepository.findByToken(refreshToken);
        
        if (storedToken) {
        await this.refreshTokenRepository.revoke(storedToken.id);
        }
    }

  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.refreshTokenRepository.revokeAllForUser(userId);
    // Также инвалидируем кэш пользователя
    await this.redisDao.invalidateUserCache(userId);
  }

}