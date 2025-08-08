import { UserData } from "@backend/grpc";

export interface IJwtTokenService {
    signAccessToken(payload: UserData, expiresIn: string): string;
    signRefreshToken(payload: UserData, expiresIn: string): string;
    verifyToken(token: string): any;
}