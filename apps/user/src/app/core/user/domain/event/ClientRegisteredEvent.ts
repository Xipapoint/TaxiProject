import { IEvent } from "@nestjs/cqrs";
import { UserId } from '../valueObjects/UserId/UserId';
import { Email } from '../valueObjects/Email/Email';

export class ClientRegisteredEvent implements IEvent {
  constructor(readonly userId: UserId, readonly email: Email) {}
}