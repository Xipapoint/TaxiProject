import { Inject } from "@nestjs/common";
import { InjectionToken } from "../../auth/constants/InjectionToken";
import { ClientDao } from "../dao/postgres/client.users.dao";
import { Client } from "../../core/user/infrastructure/entity/Client/Client";
import { AbstractUserRepository } from "./abstract.users.repository";
import { CreateClientDto } from "../../core/user/infrastructure/interface/dto/request/create/create-client.dto";

export class ClientRepository extends AbstractUserRepository<Client> {
    constructor(
        @Inject(InjectionToken.CLIENT_DAO) private readonly clientDao: ClientDao
        //TODO: ADD DAO FOR REDIS
    ) {
        super();
    }
    async findById(id: number): Promise<Client> {
        return this.clientDao.findById(id);
    }
    async findByPhoneNumber(phoneNumber: string): Promise<Client> {
        return this.clientDao.findByPhoneNumber(phoneNumber);
    }
    async create(data: CreateClientDto): Promise<Client> {
        return this.clientDao.create(data);
        //TODO: ADD REDIS CACHING REFRESH AND ACCESS TOKENS
    }
    async delete(id: number): Promise<void> {
        this.clientDao.delete(id)
    }
}