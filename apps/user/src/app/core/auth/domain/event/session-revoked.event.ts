export class SessionRevokedEvent {
  constructor(public readonly sessionId: string, public readonly reason?: string, public readonly occurredAt = new Date()) {}
}