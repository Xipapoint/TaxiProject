import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

import { ClientImplement, ClientProperties } from '../../entities';
import { Email } from '../../valueObjects/Email/Email';
import { PhoneNumber } from '../../valueObjects/PhoneNumber/PhoneNumber';
import { UserId } from '../../valueObjects/UserId/UserId';
import { UserProfileProperties } from '../../entities/UserProfile/UserProfile';

type CreateClientOptions = Readonly<{
  phoneNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  passwordHash: string;
}>;

export class ClientFactory {
  @Inject(EventPublisher) private readonly eventPublisher: EventPublisher;

  create(options: CreateClientOptions) {
    return this.eventPublisher.mergeObjectContext(
      new ClientImplement(
        {
          ...options,
          phoneNumber: new PhoneNumber(options.phoneNumber),
          email: new Email(options.email),
          id: new UserId(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          clientId: new UserId()
        }
      ),
    );
  }

  reconstitute(userProperites: UserProfileProperties, properties: ClientProperties) {
    return this.eventPublisher.mergeObjectContext(new ClientImplement(userProperites, properties));
  }
}
