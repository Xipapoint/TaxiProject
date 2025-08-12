import { Injectable, Inject } from "@nestjs/common";
import { UserSession } from "../../../domain/entities/UserSession";
import { InjectionToken } from "../../../application/injection-token";
import { IUserSessionCacheRepository } from '../../../domain/repository';
import { IUserSessionRepository } from '../../../domain/repository';
import { IUserSessionPersistanceService } from '../../../application/interface';

@Injectable()
export class UserSessionPersistenceService implements IUserSessionPersistanceService {
    constructor(
        @Inject(InjectionToken.USER_SESSION_CACHE_REPOSITORY)
        private readonly cacheRepo: IUserSessionCacheRepository,
        @Inject(InjectionToken.USER_SESSION_REPOSITORY)
        private readonly dbRepo: IUserSessionRepository
    ) {}

    async saveInDb(session: UserSession) {
        await this.dbRepo.save(session);
    }

    async saveInCache(session: UserSession) {
        await this.cacheRepo.save(session);
    }

    async save(session: UserSession) {
        await this.dbRepo.save(session);
        await this.cacheRepo.save(session);
    }

    async deleteByIdInDb(sessionId: string) {
        await this.dbRepo.deleteById(sessionId);
    }
    async deleteByIdInCache(sessionId: string) {
        await this.cacheRepo.deleteById(sessionId);
  }
}