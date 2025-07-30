import { ApiProperty } from '@nestjs/swagger';
import { Column, PrimaryColumn } from 'typeorm';
// import Address from '../../../../shared/entities/Address';

export abstract class User {
  @PrimaryColumn("uuid")
  @ApiProperty({
    type: String,
    description: "User's unique identifier",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  id: string;

  @ApiProperty({
    type: String,
    description: "User's phone number",
    example: "+1234567890",
  })
  @Column({ type: 'varchar', unique: true })
  phoneNumber: string;

  @ApiProperty({
    type: String,
    description: "User's first name",
    example: "John",
  })
  @Column({ type: 'varchar' })
  firstName: string;

  @ApiProperty({
    type: String,
    description: "User's last name",
    example: "Doe",
  })
  @Column({ type: 'varchar' })
  lastName: string;

  @ApiProperty({
    type: String,
    description: "User's email address",
    example: "john.doe@example.com",
  })
  @Column({ type: 'varchar', unique: true })
  email: string;

  @ApiProperty({
    type: String,
    format: 'date',
    description: "User's date of birth (YYYY-MM-DD)",
    example: "1990-01-01",
  })
  @Column({ type: 'date' })
  dateOfBirth: string;

  // @OneToMany(
  //   () => Address, 
  //   (address: Address) => address.user, {
  //     cascade: true,
  //   }
  // )
  // public address: Address;

  @ApiProperty({
    type: String,
    description: "Hashed user password",
    example: "$2b$10$abcdefg...",
  })
  @Column({ type: 'varchar' })
  passwordHash: string;

  @ApiProperty({
    type: String,
    format: 'date-time',
    description: "Date and time when the user was created",
    example: "2024-06-01T12:00:00.000Z",
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({
    type: String,
    format: 'date-time',
    description: "Date and time when the user was last updated",
    example: "2024-06-01T12:00:00.000Z",
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
