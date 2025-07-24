import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../core/user/infrastructure/entity/abstract.entity';

@Entity()
class Address {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public street: string;

  @Column()
  public city: string;

  @Column()
  public country: string;

  @ManyToOne(
    () => User,
    (user: User) => user.address,
  )
  public user?: User;
}

export default Address;