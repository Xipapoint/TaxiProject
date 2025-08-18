import { TokenPair, UserData } from "@backend/grpc";
import { Injectable, Inject } from "@nestjs/common";
import { IJwtTokenService, IUserSessionTokensService } from "../../../application/interface";
import { InjectionToken } from "../../../application/injection-token";

@Injectable()
export class TokenService implements IUserSessionTokensService {
  constructor(@Inject(InjectionToken.JWT_TOKEN_SERVICE) private readonly jwtService: IJwtTokenService) {}

  generateTokens(userData: UserData) {
    const accessToken = this.jwtService.signAccessToken(userData, "30m");
    const refreshToken = this.jwtService.signRefreshToken(userData, "7d");
    return { accessToken, refreshToken };
  }

  async verifyTokens(tokens: TokenPair): Promise<TokenPair> {
    const { accessToken, refreshToken } = tokens
    await this.jwtService.verifyToken(accessToken)
    await this.jwtService.verifyToken(refreshToken)
    return {accessToken, refreshToken}
  }
}