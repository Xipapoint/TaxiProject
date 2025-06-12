import { User } from './abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Driver extends User {
  @Column()
  carModel: string;

  @Column()
  carColor: string;

  @Column()
  carNumber: string;

  @Column()
  status: string;
}
