import { Inject } from "@nestjs/common";
import { InjectionToken } from "../../shared";
import { Client } from "../../core/user/infrastructure/entity/Client/Client";
import { ClientDao } from "../../users/dao/postgres/client.users.dao";
import { AbstractAuthRepository } from "./abstract.auth.repository";
import { ClientRedisAuthDao } from "../dao/redis/client-redis.auth.dao";

export class ClientRepository extends AbstractAuthRepository<Client> {
    constructor(
        @Inject(InjectionToken.USER_CLIENT_DAO) private readonly clientDao: ClientDao,
        @Inject(InjectionToken.AUTH_CLIENT_REDIS_DAO) private readonly clientRedisAuthDao: ClientRedisAuthDao
        //TODO: ADD DAO FOR REDIS
    ) {
        super();
    }
}