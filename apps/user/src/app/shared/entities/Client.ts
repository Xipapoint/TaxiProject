import { User } from './abstract.entity';
import { Entity } from 'typeorm';

@Entity()
export class Client extends User {}
