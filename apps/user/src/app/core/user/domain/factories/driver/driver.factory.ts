import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

import { DriverImplement, DriverProperties } from '../../entities';
import { Email } from '../../valueObjects/Email/Email';
import { PhoneNumber } from '../../valueObjects/PhoneNumber/PhoneNumber';
import { UserId } from '../../valueObjects/UserId/UserId';
import { UserProfileProperties } from '../../entities/UserProfile/UserProfile';
import { DRIVER_VERIFICATION_STATUS } from '../../enum/DriverVerificationStatus';

type CreateDriverOptions = Readonly<{
  phoneNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  passwordHash: string;
}>;

export class DriverFactory {
  @Inject(EventPublisher) private readonly eventPublisher: EventPublisher;

  create(options: CreateDriverOptions) {
    return this.eventPublisher.mergeObjectContext(
      new DriverImplement(
        {
          ...options,
          phoneNumber: new PhoneNumber(options.phoneNumber),
          email: new Email(options.email),
          id: new UserId(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          verificationStatus: DRIVER_VERIFICATION_STATUS.PENDING,
          isOnShift: false,
          carId: undefined
        }
      ),
    );
  }

  reconstitute(userProperites: UserProfileProperties, properties: DriverProperties) {
    return this.eventPublisher.mergeObjectContext(new DriverImplement(userProperites, properties));
  }
}
