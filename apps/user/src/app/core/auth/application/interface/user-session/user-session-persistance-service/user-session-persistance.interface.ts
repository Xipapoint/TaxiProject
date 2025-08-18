import { UserSession } from '../../../../domain/entities/UserSession';
export interface IUserSessionPersistanceService {
    save(session: UserSession): Promise<void>
    saveInDb(session: UserSession): Promise<void>
    saveInCache(session: UserSession): Promise<void>
    deleteById(sessionId: string): Promise<void>
    deleteByIdInDb(sessionId: string): Promise<void>
    deleteByIdInCache(sessionId: string): Promise<void>
}