import { UserProfile } from '../../entities/UserProfile/UserProfile';
export interface UserRepository {
  save: (account: UserProfile | UserProfile[]) => Promise<void>;
  findById: (id: string) => Promise<UserProfile | null>;
  findByEmail: (email: string) => Promise<UserProfile | null>;
  findByPhoneNumber: (email: string) => Promise<UserProfile | null>;
}