export abstract class AbstractRedisDao {
    abstract storeAuthToken(userId: number, token: string, ttlSeconds: number): Promise<void>

    abstract getAuthToken(userId: number): Promise<string | undefined>

    abstract deleteAuthToken(userId: number): Promise<void>


}