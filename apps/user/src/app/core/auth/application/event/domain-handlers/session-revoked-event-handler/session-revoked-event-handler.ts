import { Inject } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { SessionRevokedEvent } from '../../../../domain/event/session-revoked.event';
import { InjectionToken } from '../../../injection-token';
import { UserSessionCacheRepository } from '../../../../domain/repository';


@EventsHandler(SessionRevokedEvent)
export class SessionRevokedEventHandler implements IEventHandler<SessionRevokedEvent> {
  constructor(@Inject(InjectionToken.USER_SESSION_CACHE_REPOSITORY) private readonly cacheRepo: UserSessionCacheRepository) {}

  async handle(event: SessionRevokedEvent) {
    await this.cacheRepo.deleteById(event.sessionId).catch(err => {
      console.error('Failed to remove session from cache', err);
    });

  }
}