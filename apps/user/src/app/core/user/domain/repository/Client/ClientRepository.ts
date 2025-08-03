import { ClientImplement } from '../../entities';
export interface ClientRepository {
  save: (account: ClientImplement | ClientImplement[]) => Promise<void>;
  findById: (id: string) => Promise<ClientImplement | null>;
  findByEmail: (email: string) => Promise<ClientImplement | null>;
  findByPhoneNumber: (email: string) => Promise<ClientImplement | null>;
}