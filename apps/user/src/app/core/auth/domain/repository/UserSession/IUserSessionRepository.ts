import { UserSession } from '../../entities/UserSession';
export interface IUserSessionRepository {
  save: (account: UserSession | UserSession[]) => Promise<void>;
  findById: (id: string) => Promise<UserSession | null>;
  findByRefreshToken: (refreshToken: string) => Promise<UserSession | null>;
  deleteById: (id: string) => Promise<void>;
}