import { DriverImplement } from '../../entities';

export interface DriverRepository {
  save: (driver: DriverImplement | DriverImplement[]) => Promise<void>;
  findById: (id: string) => Promise<DriverImplement | null>;
  findByEmail: (email: string) => Promise<DriverImplement | null>;
  findByPhoneNumber: (phoneNumber: string) => Promise<DriverImplement | null>;
}
