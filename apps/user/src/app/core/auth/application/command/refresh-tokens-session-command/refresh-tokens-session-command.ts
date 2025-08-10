import { DeviceInfo, RefreshTokenRequest } from "@backend/grpc";
import { ICommand } from "@nestjs/cqrs";

export class RefreshTokensSessionCommand implements ICommand {
    constructor(readonly props: RefreshTokenRequest) {}
}