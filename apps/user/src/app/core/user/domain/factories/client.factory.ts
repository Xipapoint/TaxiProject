import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

import { ClientImplement, ClientProperties } from '../entities/Client';
import { Email } from '../valueObjects/Email';
import { PhoneNumber } from '../valueObjects/PhoneNumber';
import { UserId } from '../valueObjects/UserId';

type CreateClientOptions = Readonly<{
  id: UserId;
  phoneNumber: PhoneNumber;
  firstName: string;
  lastName: string;
  email: Email;
  dateOfBirth: string;
  passwordHash: string;
  addressId: string;
}>;

export class UserFactory {
  @Inject(EventPublisher) private readonly eventPublisher: EventPublisher;

  create(options: CreateClientOptions) {
    return this.eventPublisher.mergeObjectContext(
      new ClientImplement({
        ...options,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      }),
    );
  }

  reconstitute(properties: ClientProperties) {
    return this.eventPublisher.mergeObjectContext(new ClientImplement(properties));
  }
}
