import { Injectable, Inject } from "@nestjs/common";
import { UserSession } from "../../../domain/entities/UserSession";
import { InjectionToken } from "../../../application/injection-token";
import { IUserSessionCacheRepository } from '../../../domain/repository';
import { IUserSessionRepository } from '../../../domain/repository';
import { IUserSessionPersistanceService } from '../../../application/interface';

@Injectable()
export class UserSessionPersistenceService
  implements IUserSessionPersistanceService
{
  constructor(
    @Inject(InjectionToken.USER_SESSION_CACHE_REPOSITORY)
    private readonly cacheRepo: IUserSessionCacheRepository,
    @Inject(InjectionToken.USER_SESSION_REPOSITORY)
    private readonly dbRepo: IUserSessionRepository
  ) {}

  async saveInDb(session: UserSession) {
    try {
      await this.dbRepo.save(session);
    } catch (error) {
      throw error;
    }
  }

  async saveInCache(session: UserSession) {
    try {
      await this.cacheRepo.save(session);
    } catch (error) {
      throw error;
    }
  }

  async save(session: UserSession) {
    try {
      await this.dbRepo.save(session);
    } catch (dbError) {
      throw dbError;
    }
  }

  async deleteById(sessionId: string): Promise<void> {
    try {
      await this.dbRepo.deleteById(sessionId);
      await this.cacheRepo.deleteById(sessionId);
    } catch (error) {
      throw error;
    }
  }

  async deleteByIdInDb(sessionId: string) {
    try {
      await this.dbRepo.deleteById(sessionId);
    } catch (error) {
      throw error;
    }
  }
  async deleteByIdInCache(sessionId: string) {
    try {
      await this.cacheRepo.deleteById(sessionId);
    } catch (error) {
      throw error;
    }
  }
}