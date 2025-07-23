import { IEvent } from "@nestjs/cqrs";
import { UserId } from '../valueObjects/UserId';
import { Email } from '../valueObjects/Email';

export class ClientRegisteredEvent implements IEvent {
  constructor(readonly userId: UserId, readonly email: Email) {}
}