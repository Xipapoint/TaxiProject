import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsPhoneNumber,
  MinLength,
  MaxLength,
} from 'class-validator';

export class AbstractCreateUserDto {
  @ApiProperty({
    type: String,
    description: "User's phone number",
    example: '+1234567890',
  })
  @IsPhoneNumber(null, { message: 'Invalid phone number format' })
  phoneNumber: string;

  @ApiProperty({
    type: String,
    description: "User's first name",
    example: 'John',
  })
  @IsString()
  @MinLength(1, { message: 'First name cannot be empty' })
  firstName: string;

  @ApiProperty({
    type: String,
    description: "User's last name",
    example: 'Doe',
  })
  @IsString()
  @MinLength(1, { message: 'Last name cannot be empty' })
  lastName: string;

  @ApiProperty({
    type: String,
    description: "User's email address",
    example: 'john.doe@example.com',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({
    type: String,
    description: 'Plain user password',
    example: 'strongPassword123',
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(64, { message: 'Password must be at most 64 characters' })
  password: string;
}
