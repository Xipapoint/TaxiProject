import { UserData } from '@backend/grpc';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IJwtTokenService } from '../../application/interface/jwt-token-service/jwt-token-service.interface';
@Injectable()
export class JwtTokenService implements IJwtTokenService {
  private readonly accessTokenSecret: string;
  private readonly accessTokenTtl: string;
  private readonly refreshTokenSecret: string;
  private readonly refreshTokenTtl: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.accessTokenSecret = this.configService.getOrThrow<string>('JWT_ACCESS_SECRET');
    this.accessTokenTtl = this.configService.getOrThrow<string>('JWT_ACCESS_TTL');
    this.refreshTokenSecret = this.configService.getOrThrow<string>('JWT_REFRESH_SECRET');
    this.refreshTokenTtl = this.configService.getOrThrow<string>('JWT_REFRESH_TTL');
  }
    signAccessToken(payload: UserData, expiresIn: string = this.accessTokenTtl): string {
        return this.jwtService.sign(payload, {
            secret: this.accessTokenSecret,
            expiresIn,
        });
    }

    signRefreshToken(payload: UserData, expiresIn: string = this.refreshTokenTtl): string {
        return this.jwtService.sign(payload, {
            secret: this.refreshTokenSecret,
            expiresIn,
        });
    }

    async verifyToken(token: string): Promise<UserData> {
        try {
            return this.jwtService.verifyAsync(token, { secret: this.accessTokenSecret });
        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    }

}