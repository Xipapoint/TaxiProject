import { TokenPair, UserData } from '@backend/grpc';
export interface IUserSessionTokensService {
  generateTokens(userData: UserData): TokenPair
  verifyTokens(tokens: TokenPair): Promise<TokenPair>
}