import { UserSession } from '../../../domain/entities/UserSession';
export interface UserSessionTokens {
  accessToken: string;
  refreshToken: string;
  session: UserSession;
}