import { Inject, UnauthorizedException } from "@nestjs/common";
import { CreateClientDto, Client, LoginUserDto, InjectionToken } from "../../shared";
import { AbstractAuthService } from "./abstract.auth.service";
import { BadRequest, PostgresErrorCode } from "@backend/nestjs";
import bcrypt, { compare } from 'bcrypt'
import { AbstractUserRepository } from "../../users/repository/abstract.users.repository";
import { ConfigService } from "@nestjs/config";
import { JwtTokenService } from "../../jwt-token/jwt-token.service";
export class ClientService extends AbstractAuthService<Client> {
    constructor(
        @Inject(InjectionToken.USER_CLIENT_REPOSITORY) private readonly usersService: AbstractUserRepository<Client>,
        private readonly configService: ConfigService,
        private readonly jwtTokenService: JwtTokenService
    ) {
        super();
    }


    private async hashSensetiveData() {
        
    }

    private async verifyUser(data: LoginUserDto) {
        const { phoneNumber, password } = data
        try {
            const user = await this.usersService.findByPhoneNumber(phoneNumber);
            const authenticated = await compare(password, user.passwordHash);
            if (!authenticated) {
                throw new UnauthorizedException();
            }
            return user;
        } catch (err) {
            throw new UnauthorizedException('Credentials are not valid.');
        }
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
                    'User with that email or phone number already exists',
                );
            }
        }
    }

    async login(data: LoginUserDto): Promise<Client> {
        const user = await this.verifyUser(data);
        const expires = new Date();
        expires.setMilliseconds(
        expires.getTime() +
            parseInt(this.configService.getOrThrow('JWT_EXPIRATION_MS'))
        );
        const tokenPayload = {
            userId: user.id,
        };
        const accessToken = this.jwtService.sign(tokenPayload);
        response.cookie('Authentication', accessToken, {
            httpOnly: true,
            secure: !!this.configService.get('SECURE_COOKIE'),
            expires,
        });
        return user;
    }
}