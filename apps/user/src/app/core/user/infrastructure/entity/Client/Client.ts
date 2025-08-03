import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from '../User';

@Entity('clients')
export class ClientEntity {
  @PrimaryColumn("uuid")
  @ApiProperty({
    type: String,
    description: "User's unique identifier",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  clientId: string;
  
  @OneToOne(() => User, { cascade: true, eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  userId: string;
}