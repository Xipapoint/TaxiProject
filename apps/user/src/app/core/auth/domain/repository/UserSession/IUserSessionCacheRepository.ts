import { UserSession } from '../../entities/UserSession';
export interface IUserSessionCacheRepository {
  save: (account: UserSession | UserSession[]) => Promise<void>;
  findById: (id: string) => Promise<UserSession | null>;
  deleteById: (id: string) => Promise<void>;
}