import { Driver } from './Driver';
import { Column, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

export class Car {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  model: string;

  @Column()
  numberPlate: string;

  @Column()
  color: string;

  @Column()
  year: number;

  @OneToOne(() => Driver, (driver) => driver.car)
  driver: Driver;
}
