import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { TokenPayload } from '../dto';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => request.cookies?.Refresh || request.token,
      ]),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  validate(payload: TokenPayload) {
    return payload;
  }
}