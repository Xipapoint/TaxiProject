import { ICommand } from "@nestjs/cqrs";
import { CreateUserSession } from '../../dto/CreateUserSessionDto/CreateUserSessionDto';

export class CreateUserSessionCommand implements ICommand {
    constructor(public readonly props: CreateUserSession) {}
}