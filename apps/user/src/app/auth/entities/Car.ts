import { Column, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column()
  driverId: string
}
