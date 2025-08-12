import { TokensAndDataRequest } from "@backend/grpc";
import { ICommand } from "@nestjs/cqrs";

export class AuthenticateSessionCommand implements ICommand {
    constructor(readonly props: TokensAndDataRequest) {}
}