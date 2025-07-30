import { IEvent } from "@nestjs/cqrs";
import { UserId, Email } from "../valueObjects";

export class UserRegisteredEvent implements IEvent {
  constructor(readonly userId: UserId, readonly email: Email) {}
}