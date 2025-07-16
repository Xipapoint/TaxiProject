import { PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export abstract class User {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

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
    description: "Hashed user password",
    example: "$2b$10$abcdefg...",
  })
  @Column({ type: 'varchar' })
  passwordHash: string;
}
