import { PrimaryGeneratedColumn, Column } from 'typeorm';

export abstract class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  phoneNumber: string;

  @Column()
  name: string;

  @Column()
  passwordHash: string;
}
