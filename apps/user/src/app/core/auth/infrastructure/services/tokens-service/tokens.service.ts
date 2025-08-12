import { UserData } from "@backend/grpc";
import { Injectable, Inject } from "@nestjs/common";
import { IJwtTokenService, IUserSessionTokensService } from "../../../application/interface";
import { InjectionToken } from "../../../application/injection-token";

@Injectable()
export class TokenService implements IUserSessionTokensService {
  constructor(@Inject(InjectionToken.JWT_TOKEN_SERVICE) private readonly jwt: IJwtTokenService) {}

  generateTokens(userData: UserData) {
    const accessToken = this.jwt.signAccessToken(userData, "30m");
    const refreshToken = this.jwt.signRefreshToken(userData, "7d");
    return { accessToken, refreshToken };
  }
}