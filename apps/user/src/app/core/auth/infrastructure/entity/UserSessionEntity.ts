
import { Column, Entity, PrimaryColumn } from "typeorm";
import { DeviceInfo } from './DeviceInfo';
import { ApiProperty } from "@nestjs/swagger";


@Entity('user-sessions')
export class UserSessionEntity {
  @ApiProperty({
    description: 'Unique identifier for the user session',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'User ID to whom this session belongs',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Column()
  userId: string;

  @ApiProperty({
    description: 'Hash of the refresh token associated with this session',
  })
  @Column()
  refreshTokenHash: string;

  @ApiProperty({
    description: 'Information about the device from which the session was created',
    type: () => DeviceInfo,
  })
  @Column(() => DeviceInfo, { prefix: false })
  deviceInfo: DeviceInfo;

  @ApiProperty({
    description: 'Flag indicating if the session has been revoked',
    default: false,
  })
  @Column({ default: false })
  isRevoked: boolean;

  @ApiProperty({
    description: 'Timestamp when the session was created',
    example: '2025-08-07T20:00:00Z',
    type: String,
    format: 'date-time',
  })
  @Column({ type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the session expires',
    example: '2025-08-14T20:00:00Z',
    type: String,
    format: 'date-time',
  })
  @Column({ type: 'timestamptz' })
  expiresAt: Date;

  @ApiProperty({
    description: 'Timestamp when the session was last used',
    example: '2025-08-07T22:00:00Z',
    type: String,
    format: 'date-time',
    required: false,
    nullable: true,
  })
  @Column({ type: 'timestamptz', nullable: true })
  lastUsedAt?: Date;

  @ApiProperty({
    description: 'Version of user session',
  })
  @Column()
  version: number;
}