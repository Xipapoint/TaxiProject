import { ClientImplement } from '../../entities';
export interface ClientRepository {
  newId: () => Promise<string>;
  save: (account: ClientImplement | ClientImplement[]) => Promise<void>;
  findById: (id: string) => Promise<ClientImplement | null>;
  findByEmail: (email: string) => Promise<ClientImplement[]>;
  findByPhoneNumber: (email: string) => Promise<ClientImplement[]>;
}