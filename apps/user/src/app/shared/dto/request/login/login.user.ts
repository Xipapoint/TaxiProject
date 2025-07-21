import { ApiProperty } from "@nestjs/swagger";
import { IsPhoneNumber, IsString, MinLength, MaxLength } from "class-validator";

export class LoginUserDto {
    @ApiProperty({
      type: String,
      description: "User's phone number",
      example: '+1234567890',
    })
    @IsPhoneNumber(null, { message: 'Invalid phone number format' })
    phoneNumber: string;

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