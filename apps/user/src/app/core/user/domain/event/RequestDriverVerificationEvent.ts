import { IEvent } from "@nestjs/cqrs";

export class RequestDriverVerificationEvent implements IEvent {
  constructor(readonly userId: string) {}
}