import { IEvent } from "@nestjs/cqrs";

export class UserRegisteredEvent implements IEvent {
  constructor(readonly userId: string, readonly email: string) {}
}