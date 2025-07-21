import { Inject } from "@nestjs/common";
import { CreateClientDto, Client, LoginUserDto, InjectionToken } from "../../shared";
import { AbstractAuthService } from "./abstract.auth.service";
import { BadRequest, PostgresErrorCode } from "@backend/nestjs";
import bcrypt from 'bcrypt'
import { AbstractUserRepository } from "../../users/repository/abstract.users.repository";
export class ClientService extends AbstractAuthService<Client> {
    constructor(
        @Inject(InjectionToken.USER_CLIENT_REPOSITORY) private readonly usersService: AbstractUserRepository<Client>,
    ) {
        super();
    }
    
    async register(data: CreateClientDto): Promise<Client> {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        try {
            const createdUser = await this.usersService.create({
            ...data,
            password: hashedPassword,
            });
            return createdUser;
        } catch (error) {
            if (error?.code === PostgresErrorCode.UniqueViolation) {
                throw new BadRequest(
                    'User with that email already exists',
                );
            }
        }
    }
    async login(data: LoginUserDto): Promise<Client> {
        throw new Error("Method not implemented.");
    }
    
}