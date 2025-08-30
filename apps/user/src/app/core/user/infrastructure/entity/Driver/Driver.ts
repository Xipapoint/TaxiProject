import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { DRIVER_VERIFICATION_STATUS } from '../../../domain/enum/DriverVerificationStatus';
import { User } from '../User';

@Entity()
export class Driver {
  @PrimaryGeneratedColumn('uuid') clientId: string
  @OneToOne(() => User, { cascade: true })
  @JoinColumn({ name: 'userId' })
  user: User

  @Column({
    type: 'enum',
    enum: DRIVER_VERIFICATION_STATUS,
    default: DRIVER_VERIFICATION_STATUS.PENDING,
    nullable: false,
    comment: 'Driver verification status'
  })

  @ApiProperty({ enum: DRIVER_VERIFICATION_STATUS, default: DRIVER_VERIFICATION_STATUS.PENDING, description: 'Driver verification status' })
  verificationStatus: DRIVER_VERIFICATION_STATUS

  @Column({
    type: 'boolean',
    default: false,
    nullable: false,
    comment: 'Is the driver currently on shift'
  })

  @ApiProperty({ type: Boolean, default: false, description: 'Is the driver currently on shift' })
  isWorking: boolean

  @Column({
    type: 'uuid',
    nullable: true,
    comment: 'ID of the car assigned to the driver'
  })

  @ApiProperty({ type: 'string', format: 'uuid', required: false, description: 'ID of the car assigned to the driver' })
  carId?: string

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Driver\'s license number'
  })
  @ApiProperty({ type: 'string', required: false, description: 'Driver\'s license number' })
  licenseNumber?: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Vehicle model'
  })
  @ApiProperty({ type: 'string', required: false, description: 'Vehicle model' })
  vehicleModel?: string;

  @Column({
    type: 'int',
    nullable: true,
    comment: 'Vehicle year'
  })
  @ApiProperty({ type: 'number', required: false, description: 'Vehicle year' })
  vehicleYear?: number;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: 'Vehicle plate number'
  })
  @ApiProperty({ type: 'string', required: false, description: 'Vehicle plate number' })
  vehiclePlateNumber?: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Insurance number'
  })
  @ApiProperty({ type: 'string', required: false, description: 'Insurance number' })
  insuranceNumber?: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Emergency contact name'
  })
  @ApiProperty({ type: 'string', required: false, description: 'Emergency contact name' })
  emergencyContactName?: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: 'Emergency contact phone'
  })
  @ApiProperty({ type: 'string', required: false, description: 'Emergency contact phone' })
  emergencyContactPhone?: string;

  @RelationId((driver: Driver) => driver.user)
  userId: string;
}
