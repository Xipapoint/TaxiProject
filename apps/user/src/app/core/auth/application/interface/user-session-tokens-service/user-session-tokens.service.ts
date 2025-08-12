import { TokenPair, UserData } from '@backend/grpc';
import { UserSession } from '../../../domain/entities/UserSession';
export interface IUserSessionTokensService {
  generateTokens(userData: UserData): TokenPair
}