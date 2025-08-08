import { UserSession } from '../../entities/UserSession';
export interface UserSessionRepository {
  save: (account: UserSession | UserSession[]) => Promise<void>;
  findById: (id: string) => Promise<UserSession | null>;
}