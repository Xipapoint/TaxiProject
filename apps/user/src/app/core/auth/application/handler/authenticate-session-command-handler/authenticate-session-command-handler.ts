import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AuthenticateSessionCommand } from '../../command';
import { Transactional } from "@backend/nestjs";

@CommandHandler(AuthenticateSessionCommand)
export class AuthenticateSessionCommandHandler implements ICommandHandler<AuthenticateSessionCommand, void> {
    @Transactional()
    async execute(command: AuthenticateSessionCommand): Promise<void> {
        
    }
}