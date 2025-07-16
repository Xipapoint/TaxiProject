import { ApiProperty } from '@nestjs/swagger';
import { DRIVER_VERIFICATION_STATUS } from '../../shared/enum/DriverVerificationStatus';
import { User } from './abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Driver extends User {
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
  carId: string
}
