import { UserData } from "@backend/grpc";

export interface JwtTokenService {
    signAccessToken(payload: UserData, expiresIn: string): string;
    signRefreshToken(payload: UserData, expiresIn: string): string;
    verifyToken<T>(token: string): T;
}