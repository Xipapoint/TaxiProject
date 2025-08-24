import { TokenPair, UserData } from "@backend/grpc";
import { Injectable, Inject, UnauthorizedException } from "@nestjs/common";
import { IJwtTokenService, IUserSessionTokensService } from "../../../application/interface";
import { InjectionToken } from "../../../application/injection-token";
import { RpcException } from "@nestjs/microservices";

@Injectable()
export class TokenService implements IUserSessionTokensService {
  constructor(@Inject(InjectionToken.JWT_TOKEN_SERVICE) private readonly jwtService: IJwtTokenService) {}

  generateTokens(userData: UserData) {
    const accessToken = this.jwtService.signAccessToken(userData, "30m");
    const refreshToken = this.jwtService.signRefreshToken(userData, "7d");
    return { accessToken, refreshToken };
  }

  async verifyTokens(tokens: TokenPair): Promise<TokenPair> {
    const { accessToken, refreshToken } = tokens;
    try {
      await this.jwtService.verifyToken(accessToken).catch((reason) => {
        throw new UnauthorizedException(reason.message);
      });
      await this.jwtService.verifyToken(refreshToken).catch((reason) => {
        throw new UnauthorizedException(reason.message);
      });
      return { accessToken, refreshToken };
    } catch (err: any) {
      if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
        throw new UnauthorizedException(err.message);
      }

      throw new RpcException(err.message || 'Token verification failed');
    }
  }
}